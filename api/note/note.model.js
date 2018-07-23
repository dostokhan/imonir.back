const db = require('sqlite');

const {
  titleToSlug,
  noteWriter,
  moveNoteFile,
  updateNoteFile,
  prepareUpdateQuery,
  renameFile,
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
  },
  list: async (authorized) => {
    const sql = authorized ?
      'SELECT * FROM note LIMIT 10' :
      'SELECT * FROM note WHERE isPublished=1 LIMIT 10';
    // const sql = 'SELECT * FROM note LIMIT 10';
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
      console.log('UPDATING NOTE FILE');

      try {
        await updateNoteFile(slug, content);
        console.log(note);
        return { note };
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    if (changes.titleChanged) {
      try {
        console.log('TITLE changed');
        const noteObj = await NoteModel.get(note.id);

        if (!noteObj) {
          return false;
        }

        console.log(noteObj);
        if (noteObj.title !== note.title) {
          try {
            const oldSlug = titleToSlug(noteObj.title);
            const newSlug = titleToSlug(note.title);
            console.log(`new: ${newSlug} old: ${oldSlug}`);
            renameFile(oldSlug, newSlug);
          } catch (error) {
            console.log(error);
            return false;
          }
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    if (changes.needNoteTableUpdate) {
      console.log('NEED TABLE UPDATE');
      try {
        await db.all(changes.query, note.id); // db.run(sql, noteId);

        if (note.content) {
          console.log('NEED TO UPDATE CONTENT');
          updateFile(changes.slug, note.content);
        }

        return { note };
      } catch (error) {
        console.log(error);
        return false;
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

