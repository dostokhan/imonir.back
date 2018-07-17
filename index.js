const dotenv = require('dotenv');
const db = require('sqlite');
const Promise = require('bluebird');

const auth = require('http-auth');
// Set '' to config path to avoid middleware serving the html page
// (path must be a string not equal to the wanted route)
const statusMonitor = require('express-status-monitor')({ path: '' });
const cookieParser = require('cookie-parser');
//
const envFile = process.env.NODE_ENV === 'production' ?
  'config/.env.production' :
  'config/.env.development';

dotenv.load({ path: envFile });


const server = require('./config/express');
/**
 * Express configuration.
 */
// server.use(expressStatusMonitor());
const basic = auth.basic({ realm: 'Monitor Area' }, (user, pass, callback) => {
  callback(user === process.env.HTTP_AUTH_USER && pass === process.env.HTTP_AUTH_PASSWORD);
});

// use the "middleware only" property to manage websockets
server.use(statusMonitor.middleware);
server.get('/status', auth.connect(basic), statusMonitor.pageRoute);

server.use(cookieParser());
server.disable('x-powered-by');


require('./app/routes')(server);


Promise.resolve()
  // First, try to open the database
  .then(() => db.open('./database.sqlite', { Promise, cached: true }))
  // Update db schema to the latest version using SQL-based migrations
  .then(() => {
    if (process.env.NODE_ENV === 'production') {
      return db.migrate();
    }

    return db.migrate({ force: 'last' });
  })
  // Display error message if something went wrong
  .catch(err => console.error(err.stack))
  // Finally, launch the Node.js app
  .finally(() =>
    server.listen(process.env.PORT, () => {
      console.warn('we are ready :)');
    }));
