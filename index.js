const db = require('sqlite');
const Promise = require('bluebird');


const {
  env,
  port,
} = require('./config/vars');
/**
 * Express configuration.
 */
const server = require('./config/express');

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
