const noteRoutes = require('./note_routes');
const authRoutes = require('./auth_routes');
const commitRoutes = require('./commit_routes');

module.exports = (server) => {
  noteRoutes(server);
  authRoutes(server);
  commitRoutes(server);
};
