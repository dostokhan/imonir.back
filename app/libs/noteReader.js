const fs = require('fs');
const path = require('path');

const noteReader = relativePath =>
  new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '../notes/') + relativePath;

    fs.readFile(fullPath, 'utf-8', (err, text) => {
      if (err) {
        return reject(err);
      }

      return resolve(text);
    });
  });

module.exports = noteReader;
