import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as tesseract from 'tesseract.js';  // Librairie OCR pour extraire le texte

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService) {}

  async verifyDocument(file: Express.Multer.File): Promise<any> {
    // Utilisation de tesseract pour extraire les informations du document
    console.log("heelllo")
    console.log("file",file)
    const textData = await tesseract.recognize(file.buffer, 'eng');
    const extractedText = textData.data.text;

    // Logique pour analyser et comparer le texte extrait
    const nameFromDocument = this.extractNameFromText(extractedText);

    // Trouver l'utilisateur connecté (ceci est juste un exemple)
    const user = await this.findUserFromSession(); // Logique d'authentification à mettre en place

    if (nameFromDocument && user.name === nameFromDocument) {
      return { message: 'Vérification réussie', valid: true };
    } else {
      return { message: 'Vérification échouée', valid: false };
    }
  }

  // Méthode pour extraire le nom depuis le texte OCR (exemple basique)
  extractNameFromText(text: string): string {
    // Exemple de logique simple pour extraire le nom
    const nameRegex = /Nom:\s*(\w+)/;  // Regex pour trouver le nom
    const match = text.match(nameRegex);
    return match ? match[1] : null;
  }

  // Exemple de méthode pour récupérer l'utilisateur connecté
  async findUserFromSession() {
    // Logique pour récupérer les informations de l'utilisateur (exemple)
    return { name: 'John Doe', id: 123 };  // Remplacer par une vraie logique d'authentification
  }
}
