const db = require('sqlite');
const Promise = require('bluebird');

const auth = require('http-auth');
// Set '' to config path to avoid middleware serving the html page
// (path must be a string not equal to the wanted route)
const statusMonitor = require('express-status-monitor')({ path: '' });

/**
 * Express configuration.
 */
const server = require('./config/express');


const {
  authUser,
  authPassword,
  env,
  port,
} = require('./config/vars');

// server.use(expressStatusMonitor());
const basic = auth.basic({ realm: 'Monitor Area' }, (user, pass, callback) => {
  callback(user === authUser && pass === authPassword);
});

// use the "middleware only" property to manage websockets
server.use(statusMonitor.middleware);
server.get('/status', auth.connect(basic), statusMonitor.pageRoute);


require('./app/routes')(server);


Promise.resolve()
  // First, try to open the database
  .then(() => db.open('./database.sqlite', { Promise, cached: true }))
  // Update db schema to the latest version using SQL-based migrations
  .then(() => {
    if (env === 'production') {
      return db.migrate();
    }

    return db.migrate({ force: 'last' });
  })
  // Display error message if something went wrong
  .catch(err => console.error(err.stack))
  // Finally, launch the Node.js app
  .finally(() =>
    server.listen(port, () => {
      console.warn('we are ready :)');
    }));
