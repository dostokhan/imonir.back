const noteRoutes = require('./note_routes');

module.exports = (server) => {
  noteRoutes(server);
};
