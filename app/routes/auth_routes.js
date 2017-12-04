const passport = require('passport');

module.exports = (server) => {
  // fetch note
  server.get('/auth',
    passport.authenticate('github', { session: false }));

  // list of notes, latest 10
  // server.get('/note', (req, res) => {
  //   const path = 'list.json';
  //   noteReader(path)
  //     .then((content) => {
  //       renderNote(req, res, content, true);
  //     }, (err) => {
  //       renderErr(res, err);
  //     });
  // });
};
