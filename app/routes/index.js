const noteRoutes = require('./note_routes');

module.exports = (server, db) => {
  noteRoutes(server, db);
};
