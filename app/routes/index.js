const noteRoutes = require('./note_routes');
const authRoutes = require('./auth_routes');

module.exports = (server) => {
  noteRoutes(server);
  authRoutes(server);
};
