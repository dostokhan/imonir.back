const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Note = require('./note.model');

const {
  getNoteContent,
} = require('./note.util');
// const { handler: errorHandler } = require('../middlewares/error');


/**
 * Get user
 * @public
 */
exports.get = async (req, res) => {
  const key = req.params.id;
  try {
    const note = await Note.get(key);
    console.log(note);

    let content;
    try {
      content = await getNoteContent(note.slug);
    } catch (err) {
      console.log(err);
      res.status(httpStatus.NOTE_FOUND).end();
    }

    res.status(httpStatus.OK).json({ note, content });
  } catch (err) {
    res.status(httpStatus.NOT_FOUND).end();
  }
};


/**
 * Create new note
 * @private
 */
exports.create = async (req, res, next) => {
  try {
    const { note } = req.body;
    console.info('CREATE NOTE');
    // console.log(note);
    const noteObj = await Note.create(note);
    // console.log('noteObj');
    // console.log(noteObj);
    if (noteObj) {
      console.log(noteObj);
      res.status(httpStatus.CREATED).json(noteObj);
    }
  } catch (error) {
    // res.status(httpStatus.BAD_REQUEST).end(error);
    next(error);
  }
};

/**
 * Update existing note
 * @public
 */
exports.update = (req, res, next) => {
  const note = req.body.note;
  note.id = req.params.id;

  console.log(note);
  console.log(`note: ${note.id}`);

  Note.update(note)
    .then((updatedNote) => {
      console.log('UPDATED');
      console.log(updatedNote);
      res.json(updatedNote);
    })
    .catch(e => next(e));
};

/**
 * Get list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notes = await Note.list(req.auth);
    // const transformedUsers = users.map(user => user.transform());
    res.json({ notes });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  console.log(`Delete Note: ${req.params.id}`);

  Note.remove(req.params.id, req.body.title)
    .then(() => res.status(httpStatus.OK).end())
    .catch(e => next(e));

  res.status(httpStatus.NO_CONTENT).end();
};
