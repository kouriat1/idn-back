const Tesseract = require('tesseract.js');
const fs = require('fs');


const imagePath = 'cartetest.png'; // Replace with the actual path to your image

fs.readFile(imagePath, (err, data) => {
  if (err) {
    console.error('Error reading image:', err);
    return;
  }

  Tesseract.recognize(data, 'eng')
    .then(result => {
      console.log('Extracted text:', result.data.text);
    })
    .catch(error => {
      console.error('Error during OCR:', error);
    });
});