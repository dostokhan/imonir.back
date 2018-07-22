const fs = require('fs');
const path = require('path');

const notePath = relativePath => `${path.join(__dirname, './files/')}${relativePath}.md`;
const noteMovePath = relativePath => `${path.join(__dirname, './files/deleted/')}${relativePath}.md`;

const titleToSlug = title => title
  .toLowerCase()
  .replace(/[^\w ]+/g, '')
  .replace(/ +/g, '-');

const noteWriter = async (relativePath, content) =>
  new Promise((resolve, reject) => {
    const fullPath = notePath(relativePath);
    console.log(`Writing Note file: ${fullPath}`);

    return fs.writeFile(fullPath, content, (err) => {
      if (err) {
        console.log('NOTE WRITE FAIL');
        console.log(err);
        return reject(err);
      }

      console.log('NOTE WRITE SUCCESS');
      return resolve(true);
    });
  });

const updateNoteFile = (noteSlug, noteContent) =>
  noteWriter(noteSlug, noteContent).then(
    () => {
      console.log('update note CONTENT written to note file');
      console.log(noteContent);
      responseObj.noteId = noteId;
      return sendResponse();
    },
    (err) => {
      console.log(err);
      statusCode = 500;
      responseObj.msg = 'tails on fire';
      return sendResponse();
    });

const moveNoteFile = async relativePath =>
  new Promise((resolve, reject) => {
    const fullPath = notePath(relativePath);
    const removePath = noteMovePath(relativePath);

    console.log(`MOve file: ${fullPath} => ${removePath}`);
    fs.rename(fullPath, removePath, (err) => {
      if (err) {
        console.warn(err);
        console.warn('file move failed');
        return reject();
      }

      return resolve();
    });
  });
// const deleteNote = (relativePath) => {
//   const fullPath = notePath(relativePath);

//   fs.unlink(fullPath);
// };

const getNoteContent = relativePath =>
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

const prepareUpdateQuery = (note) => {
  let query = 'UPDATE note SET';
  let slug = '';
  let needNoteTableUpdate = false;

  Object.keys(note).forEach((key) => {
    console.log(`key: ${key}`);

    if (key !== 'id') {
      if (key === 'title') {
        // titleChanged = true;
        slug = titleToSlug(note[key]);
        query += ` slug = '${slug}',`;
        needNoteTableUpdate = true;
      } else if (key !== 'content') {
        query += ` ${key} = '${note[key]}',`;
        needNoteTableUpdate = true;
      }
    }
  });

  query = query.slice(0, -1);
  query += ' WHERE id = ?';

  return {
    query,
    slug,
    needNoteTableUpdate,
  };
};


module.exports = {
  titleToSlug,
  noteWriter,
  moveNoteFile,
  updateNoteFile,
  prepareUpdateQuery,
  getNoteContent,
  // deleteNote,
  // noteReader,
};

