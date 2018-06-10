const { noteReader, noteWriter } = require('../libs/noteReader.js');
const helper = require('../libs/helper');
const expressJwt = require('express-jwt');
const db = require('sqlite');

const renderErr = (res, err) => {
  console.error(err);
  // res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
  // return res.json({ error: 'Could not retrieve Note' });

  res.statusCode = 500;
  res.end('chotar !.');
};


const authenticate = (credentialsRequired = true) =>

  expressJwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
    credentialsRequired,
    getToken: (req) => {
      if (req.headers['mj-token']) {
        return req.headers['mj-token'];
      }
      return null;
    },
  });

const createNote = async (req, res, next) => {
  const { note } = req.body;
  console.log(note);

  if (note) {
    const slug = helper.titleToSlug(note.title);
    try {
      const noteId = await db.run('INSERT INTO Note (title, slug, date) VALUES (?, ?, ?)',
        note.title,
        slug,
        note.date,
      );

      noteWriter(slug, note.content)
        .then(() => {
          res.status(201).send({ noteId });
        }, (err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  }
};

const lookupNote = async (req, res, next) => {
  const noteSlug = req.params.noteslug;
  const selector = !isNaN(noteSlug) ?
    'id = ?' : 'slug = ?';
  const sql = `SELECT * FROM note WHERE ${selector}`;

  console.log(`query: ${sql}`);

  try {
    const note = await db.all(sql, noteSlug); // db.run(sql, noteId);
    if (note.length === 0) {
      res.status(404).send({ error: 'Note not found' });
    }

    console.log(note);
    req.note = note[0];
    next();
  } catch (err) {
    renderErr(res, err);
  }
};
const lookupNoteContent = async (req, res) => {
  const noteSlug = req.note.slug; // req.params.noteslug;

  console.log(`read: ${noteSlug}`);

  noteReader(noteSlug)
    .then((content) => {
      res.status(200)
        .send(JSON.stringify({ note: req.note, content }));
    }, (err) => {
      renderErr(res, err);
    });
};

const updateNote = async (req, res) => {
  const note = req.body.note;
  const noteId = req.params.id;
  let sql = 'UPDATE note SET';
  let needNoteTableUpdate = false;
  // let titleChanged = false;
  let slug = '';
  const responseObj = {};
  let statusCode = 200;
  const sendResponse = () => res.status(statusCode).send(responseObj);
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

  Object.keys(note).forEach((key) => {
    console.log(`key: ${key}`);

    if (key === 'title') {
      // titleChanged = true;
      slug = helper.titleToSlug(note[key]);
      sql += ` slug = '${slug}',`;
      needNoteTableUpdate = true;
    } else if (key !== 'content') {
      sql += ` ${key} = '${note[key]}',`;
      needNoteTableUpdate = true;
    }
  });

  sql = sql.slice(0, -1);
  sql += ' WHERE id = ?';
  console.log(`query: ${sql}`);
  console.log(`NoteId: ${noteId}`);


  if (needNoteTableUpdate) {
    try {
      const updatedNote = await db.all(sql, noteId); // db.run(sql, noteId);
      if (!updatedNote) {
        statusCode = 404;
        responseObj.msg = 'no idea';
      } else {
        // if (titleChanged) {
        //   // remove old note file
        //   deleteNote(req.note.slug);
        // }
        if (note.content) {
          return updateNoteFile(slug, note.content);
        }

        responseObj.noteId = noteId;
        return sendResponse();
      }
    } catch (err) {
      statusCode = 500;
      responseObj.msg = 'tails on fire';
      return sendResponse();
    }
  } else if (note.content) {
    return updateNoteFile(slug, note.content);
  }
};

module.exports = (server) => {
  // fetch note
  server.get('/note/:noteslug', lookupNote, lookupNoteContent);

  server.get('/note', authenticate(false), async (req, res, next) => {
    const sql = req.auth ?
      'SELECT * FROM Note LIMIT 10' : 'SELECT * FROM Note WHERE isPublished=1  LIMIT 10';

    try {
      const notes = await db.all(sql); // <=
      res.send({ notes });
    } catch (err) {
      next(err);
    }
  });

  server.post('/note', authenticate(), createNote);
  server.patch('/note/:id', authenticate(), updateNote);
};
