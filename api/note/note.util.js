const fs = require('fs');
const path = require('path');

const notePath = relativePath => `${path.join(__dirname, './files/')}${relativePath}.md`;
const noteMovePath = relativePath => `${path.join(__dirname, './files/deleted/')}${relativePath}.md`;

const titleToSlug = title => title
  .toLowerCase()
  .replace(/[^\w ]+/g, '')
  .replace(/ +/g, '-');

const noteWriter = async (slug, content) =>
  new Promise((resolve, reject) => {
    const fullPath = notePath(slug);
    console.log(`Writing Note file: ${fullPath}`);
    console.log(content);

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

const updateNoteFile = async (noteSlug, noteContent) => {
  try {
    noteWriter(noteSlug, noteContent).then(
      () => true,
      (err) => {
        console.log(err);
        return false;
        // return sendResponse();
      });
  } catch (error) {
    console.log(error);
    return false;
  }

  return false;
};


const renameFile = async (oldPath, newPath) =>
  new Promise((resolve, reject) => {
    const oldFile = notePath(oldPath);
    const newFile = notePath(newPath);

    console.log(`Rename file: ${oldFile} => ${newFile}`);
    fs.rename(oldFile, newFile, (err) => {
      if (err) {
        console.warn(err);
        console.warn('file rename failed');
        return reject();
      }

      return resolve();
    });
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
  let titleChanged = false;

  Object.keys(note).forEach((key) => {
    console.log(`key: ${key}`);

    if (key !== 'id') {
      if (key === 'title') {
        titleChanged = true;
        slug = titleToSlug(note[key]);
        query += ` slug = '${slug}',`;
        query += ` title = '${note[key]}',`;
        needNoteTableUpdate = true;
      } else if (key !== 'content') {
        query += ` ${key} = '${note[key]}',`;
        needNoteTableUpdate = true;
      }

      // if (key != 'content') {
      //   needNoteTableUpdate = true;
      // query += ` ${key} = '${note[key]}',`;
      // }
    }
  });

  query = query.slice(0, -1);
  query += ' WHERE id = ?';

  return {
    query,
    slug,
    needNoteTableUpdate,
    titleChanged,
  };
};


module.exports = {
  titleToSlug,
  noteWriter,
  moveNoteFile,
  updateNoteFile,
  prepareUpdateQuery,
  getNoteContent,
  renameFile,
};

