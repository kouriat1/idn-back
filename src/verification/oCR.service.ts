import * as tesseract from 'tesseract.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OCRService {
  async extractTextFromImage(buffer: Buffer): Promise<string> {
    console.log("ocr 0");
    try {
      const result = await tesseract.recognize(buffer, 'eng');
      console.log("my text",result.data.text);
      return result.data.text;
    } catch (error) {
      console.error("Error during OCR:", error);
      // Handle the error appropriately (e.g., return an error message, log more details)
      // You can return a default text or reject the promise.
    }
  }
}