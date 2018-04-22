const express = require('express');
const dotenv = require('dotenv');
const db = require('sqlite');
const Promise = require('bluebird');
const passport = require('passport');

const auth = require('http-auth');
// Set '' to config path to avoid middleware serving the html page
// (path must be a string not equal to the wanted route)
const statusMonitor = require('express-status-monitor')({ path: '' });
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
//
const envFile = process.env.NODE_ENV === 'production' ?
  'config/.env.production' :
  'config/.env.development';

dotenv.load({ path: envFile });

const passportConfig = require('./config/passport');

const server = express();
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

server.use(compression());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.disable('x-powered-by');
server.use(
  cors({
    origin(origin, cb) {
      const whitelist = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : [];
      cb(null, whitelist.includes(origin));
    },
    methods: 'GET, POST, PATCH',
    // exposeHeaders: ['mj-token'],
    credentials: true,
  }),
);

server.use(passport.initialize());

require('./app/routes')(server);


Promise.resolve()
  // First, try to open the database
  .then(() => db.open('./database.sqlite', { Promise, cached: true }))      // <=
  // Update db schema to the latest version using SQL-based migrations
  .then(() =>  {
    if (process.env.NODE_ENV === 'production') {
      return db.migrate();
    }

    return db.migrate({ force: 'last' });
  })                  // <=
  // Display error message if something went wrong
  .catch((err) => console.error(err.stack))
  // Finally, launch the Node.js app
  .finally(() =>
    server.listen(process.env.PORT, () => {
      console.warn('we are ready :)');
    })
  );
