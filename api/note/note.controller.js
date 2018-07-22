const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Note = require('./note.model');

const {
  getNoteContent,
} = require('./note.util');
// const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
// exports.load = async (req, res, next, id) => {
//   try {
//     const user = await User.get(id);
//     req.locals = { user };
//     return next();
//   } catch (error) {
//     return errorHandler(error, req, res);
//   }
// };

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

  // const lookupNoteContent = async (req, res) => {
  //   const noteSlug = req.note.slug; // req.params.noteslug;
  //

  //   console.log(`read: ${noteSlug}`);

  //   noteReader(noteSlug)
  //     .then((content) => {
  //       res.status(200)
  //         .send(JSON.stringify({ note: req.note, content }));
  //     }, (err) => {
  //       renderErr(res, err);
  //     });
  // };
}; // res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
// exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new note
 * @public
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
    // const savedUser = await user.save();
    // res.json(savedUser.transform());
  } catch (error) {
    // res.status(httpStatus.BAD_REQUEST).end(error);
    next(error);
    // next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
// exports.replace = async (req, res, next) => {
//   try {
//     const { user } = req.locals;
//     const newUser = new User(req.body);
//     const ommitRole = user.role !== 'admin' ? 'role' : '';
//     const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

//     await user.update(newUserObject, { override: true, upsert: true });
//     const savedUser = await User.findById(user._id);

//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };

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
    .then(savedNote => res.json(savedNote))
    .catch(e => next(e));
};

/**
 * Get list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notes = await Note.list();
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
  // const { user } = req.locals;

  // user.remove()
  //   .then(() => res.status(httpStatus.NO_CONTENT).end())
  //   .catch(e => next(e));
};
