const db = require('sqlite');
const repo = require('../libs/repo');

const lookupCommit = async (req, res, next) => {
  // check if fetching commit is necessary ?
  // 24 hours after last fetch &&
  // currently no running/scheduled task

  // fetch 20 latest commits from db
  // if result is empty and no task running
  // schedule a task in 5 minutes
  //

  repo.fetchCommits();

  req.statusCode = 200;
  res.json({ ok: 'john'});

  // const noteSlug = req.params.noteslug;
  // const sql = 'SELECT * FROM note WHERE slug = ?';

  // console.log(`NoteSlug: ${noteSlug}`);
  // try {
  //   const note = await db.all(sql, noteSlug); // db.run(sql, noteId);
  //   if (note.length === 0) {
  //     res.statusCode = 404;
  //     return res.send({ error: 'Note not found' });
  //   }

  //   console.log(note);
  //   req.note = note[0];
  //   next();
  // } catch (err) {
  //   renderErr(res, err);
  // }
};

module.exports = (server) => {
  // fetch note
  server.get('/commit/', lookupCommit);

};
