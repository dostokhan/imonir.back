const Note = require('../models/note');

module.exports = (server) => {
  server.post('/notes', (req, res) => {
    const note = new Note({
      title: req.body.title,
      body: req.body.body,
    });

    note.save((err) => {
      if (err) {
        res.send({ error: 'An Error Occured' });
      } else {
        res.status(201);
      }
    });

    // db.collection('notes').insert(note, (err, result) => {
    // });
  });
};
