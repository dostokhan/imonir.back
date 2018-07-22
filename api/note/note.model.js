const db = require('sqlite');

const {
  titleToSlug,
  noteWriter,
  moveNoteFile,
  updateNoteFile,
  prepareUpdateQuery,
} = require('./note.util');

const NoteModel = {
  get: async (key) => {
    const selector = !isNaN(key) ?
      'id = ?' : 'slug = ?';
    const sql = `SELECT * FROM note WHERE ${selector}`;

    console.log(`query: ${sql}`);
    console.log(`key: ${key}`);

    try {
      const noteArray = await db.all(sql, key); // db.run(sql, noteId);
      if (noteArray.length === 0) {
        return false;
      }

      return noteArray[0];
    } catch (err) {
      return false;
    }

    // const noteSlug = noteIdentifier;
    // const selector = !isNaN(noteSlug) ?
    //   'id = ?' : 'slug = ?';
    // const sql = `SELECT * FROM note WHERE ${selector}`;

    // console.log(`query: ${sql}`);

    // try {
    //   const note = await db.all(sql, noteSlug); // db.run(sql, noteId);
    //   if (note.length === 0) {
    //     res.status(404).send({ error: 'Note not found' });
    //   }

    //   console.log(note);
    //   req.note = note[0];
    //   next();
    // } catch (err) {
    //   renderErr(res, err);
    // }
  },
  list: async () => {
    const sql = 'SELECT * FROM note LIMIT 10';
    console.log(sql);

    try {
      const notes = await db.all(sql);
      return notes;
    } catch (err) {
      return false;
    }
  },
  create: async (note) => {
    const slug = titleToSlug(note.title);

    try {
      const dbObj = await db.run('INSERT INTO Note (title, slug, date) VALUES (?, ?, ?)',
        note.title,
        slug,
        note.date,
      );
      if (!dbObj) {
        console.log('Note Db Record Create failed');
        return false;
      }

      try {
        await noteWriter(slug, note.content);
        return { id: dbObj.lastID };
      } catch (err) {
        console.warn('Note File Write failed');
        return false;
      }
      // .then(() => {
      //   return true;
      //   // res.status(httpStatus.CREATED).send({ noteId });
      // }, (err) => {
      //   return false;
      //   // next(err);
      // });
    } catch (err) {
      console.warn('Db Write Failed');
      return false;
      // next(err);
    }
  },
  update: async (note) => {
    const changes = prepareUpdateQuery(note);
    console.log(changes.query);

    const updateFile = async (slug, content) => {
      try {
        await updateNoteFile(slug, content);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    if (changes.needNoteTableUpdate) {
      console.log('NEED TABLE UPDATE');
      try {
        await db.all(changes.query, note.id); // db.run(sql, noteId);

        // if (!updatedNote) {
        //   statusCode = 404;
        //   responseObj.msg = 'no idea';
        // } else {
        //   // if (titleChanged) {
        //   //   // remove old note file
        //   //   deleteNote(req.note.slug);
        //   // }
        if (note.content) {
          console.log('NEED TO UPDATE CONTENT');
          updateFile(changes.slug, note.content);
        }

        // responseObj.noteId = note.id;
        // return sendResponse();
        return true;
      } catch (error) {
        console.log(error);
        return false;
        // statusCode = 500;
        // responseObj.msg = 'tails on fire';
        // return sendResponse();
      }
    } else if (note.content) {
      updateFile(changes.slug, note.content);
    }

    return true;
  },
  remove: async (id, title) => {
    const sql = `DELETE FROM note WHERE id=${id}`;
    console.log(`SQL: ${sql}`);
    const slug = titleToSlug(title);

    try {
      const noteId = await db.run(sql);

      console.log(noteId);

      moveNoteFile(slug);

      console.log('DELETE DONE');
      return true;
      // res.status(200);
      // if (mongoose.Types.ObjectId.isValid(id)) {
      //   user = await this.findById(id).exec();
      // }
      // if (user) {
      //   return user;
      // }

      // throw new APIError({
      //   message: 'Note does not exist',
      //   status: httpStatus.NOT_FOUND,
      // });
    } catch (error) {
      return false;
      // throw error;
    }
  },
};

module.exports = NoteModel;

