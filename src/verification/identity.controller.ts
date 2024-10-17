import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OCRService } from './oCR.service';
import * as fs from 'fs';

@Controller('identity')
export class IdentityController {
  constructor(private readonly ocrService: OCRService) {}

  @Post('verify')
  @UseInterceptors(FileInterceptor('document'))
  async verifyIdentity(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') userName: string // Ajouter le nom de l'utilisateur via le body de la requête
  ) {
    if (!file) {
      throw new BadRequestException('Document non fourni');
    }

    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Format de fichier non pris en charge. Veuillez télécharger un fichier PNG ou JPEG.');
    }

    const filePath = file.path;

    return new Promise((resolve, reject) => {
      fs.readFile(filePath, async (err, data) => {
        if (err) {
          console.error('Erreur lors de la lecture de l\'image :', err);
          reject(new BadRequestException('Erreur lors de la lecture du fichier.'));
          return;
        }

        try {
          const extractedText = await this.ocrService.extractTextFromImage(data);
          
          // Supprimer le fichier après traitement
          fs.unlinkSync(filePath);

          // Vérifier si le nom de l'utilisateur est dans le texte extrait
          const nameMatches = this.doesNameMatch(extractedText, userName);

          if (!nameMatches) {
            reject(new BadRequestException('Le nom de l\'utilisateur ne correspond pas à celui du document.'));
            return;
          }

          resolve({ message: 'Identité vérifiée avec succès', extractedText });
        } catch (ocrError) {
          reject(new BadRequestException('Erreur lors de l\'extraction du texte : ' + ocrError.message));
        }
      });
    });
  }

  // Fonction pour vérifier si le nom de l'utilisateur est dans le texte extrait
  private doesNameMatch(extractedText: string, userName: string): boolean {
    const normalizedText = extractedText.toLowerCase();
    const normalizedUserName = userName.toLowerCase();

    // Chercher si le nom complet de l'utilisateur est dans le texte extrait
    return normalizedText.includes(normalizedUserName);
  }
}
