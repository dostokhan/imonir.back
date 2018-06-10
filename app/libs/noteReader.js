const fs = require('fs');
const path = require('path');

const notePath = relativePath => `${path.join(__dirname, '../notes/')}${relativePath}.md`;

const deleteNote = (relativePath) => {
  const fullPath = notePath(relativePath);

  fs.unlink(fullPath);
};

const noteReader = relativePath =>
  new Promise((resolve, reject) => {
    const fullPath = notePath(relativePath);
    console.log(`reading file ${fullPath}`);
    fs.readFile(fullPath, 'utf-8', (err, text) => {
      if (err) {
        return reject(err);
      }

      return resolve(text);
    });
  });

const noteWriter = (relativePath, content) =>
  new Promise((resolve, reject) => {
    const fullPath = notePath(relativePath);
    console.log(`Writing Note file: ${fullPath}`);

    fs.writeFile(fullPath, content, (err) => {
      if (err) {
        console.log('NOTE WRITE FAIL');
        console.log(err);
        return reject(err);
      }

      console.log('NOTE WRITE SUCCESS');
      return resolve();
    });
  });

module.exports = {
  deleteNote,
  noteReader,
  noteWriter,
};

