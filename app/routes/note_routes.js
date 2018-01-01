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

const renderNote = (req, res, content, contentJson = false) => {
  console.log(content);
  // var htmlContent = this.message.marked(this.rawContent);
  // var responseContent = this.message.mustacheTemplate(html, { postContent: htmlContent });

      // res.setHeader('Content-Type', 'application/json');
  if (contentJson) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(content);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ key: req.params.notename, content }));
  }
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
  const sql = 'SELECT * FROM note WHERE slug = ?';

  console.log(`NoteSlug: ${noteSlug}`);
  try {
    const note = await db.all(sql, noteSlug); // db.run(sql, noteId);
    if (note.length === 0) {
      res.statusCode = 404;
      return res.send({ error: 'Note not found' });
    }

    console.log(note);
    req.note = note[0];
    next();
  } catch (err) {
    renderErr(res, err);
  }
};
const lookupNoteContent = async (req, res, next) => {
  const noteSlug = req.params.noteslug;

  console.log(`read: ${noteSlug}`);

  noteReader(noteSlug)
    .then((content) => {
      // renderNote(req, res, content);
      res.send(JSON.stringify({ note: req.note, content, }));
    }, (err) => {
      renderErr(res, err);
    });
};

const updateNote = async (req, res, next) => {

  const note = req.body.note;
  const noteId = req.params.id;
  let sql = 'UPDATE note SET';

  console.log(req.auth);

  Object.keys(note).forEach((key) => {
    sql += ` ${key} = ${note[key]},`;
  });

  sql = sql.slice(0, -1);
  sql += ' WHERE id = ?';

  console.log(`query: ${sql}`);
  // const sql = 'UPDATE note SET WHERE id = ?';

  console.log(`NoteId: ${noteId}`);

  try {
    const note = await db.all(sql, noteId); // db.run(sql, noteId);
    if (!note) {
      res.statusCode = 404;
      return res.json({ error: 'Note not found' });

    }
    console.log(note);

    req.statusCode = 200;
    res.json({ id: noteId });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return res.json({ error: 'Could not retrieve Note' });
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
