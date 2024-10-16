import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OCRService } from './oCR.service';
import * as fs from 'fs';

@Controller('identity')
export class IdentityController {
  constructor(private readonly ocrService: OCRService) {}

  @Post('verify')
  @UseInterceptors(FileInterceptor('document'))
  async verifyIdentity(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Document non fourni');
    }

    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Format de fichier non pris en charge. Veuillez télécharger un fichier PNG ou JPEG.');
    }

    const filePath = file.path;

    // Lire le fichier en mémoire
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, async (err, data) => {
        if (err) {
          console.error('Erreur lors de la lecture de l\'image :', err);
          reject(new BadRequestException('Erreur lors de la lecture du fichier.'));
          return;
        }

        try {
          // Extraire le texte à partir du buffer de données
          const extractedText = await this.ocrService.extractTextFromImage(data);

          // Supprimer le fichier après le traitement
          fs.unlinkSync(filePath);

          resolve({ extractedText });
        } catch (ocrError) {
          reject(new BadRequestException('Erreur lors de l\'extraction du texte : ' + ocrError.message));
        }
      });
    });
  }
}
