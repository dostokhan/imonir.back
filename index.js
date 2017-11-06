const express = require('express');
const dotenv = require('dotenv');

const auth = require('http-auth');
// Set '' to config path to avoid middleware serving the html page
// (path must be a string not equal to the wanted route)
const statusMonitor = require('express-status-monitor')({ path: '' });
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
// const MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');
// const db = require('./config/db');
//
dotenv.load({ path: 'config/.env.development' });

const server = express();

/**
 * Express configuration.
 */
// server.use(expressStatusMonitor());
const basic = auth.basic({realm: 'Monitor Area'}, function(user, pass, callback) {
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
    credentials: true,
  }),
);


require('./app/routes')(server);

server.listen(process.env.PORT, () => {
  console.warn('we are ready :)');
});

// mongoose.connect(db.url, { useMongoClient: true });
// const dbConnection = mongoose.connection;

// dbConnection.on('error', console.error.bind(console, 'connection-error'));

// dbConnection.once('open', () => {
//   require('./app/routes')(server, {});

//   server.listen(port, () => {
//     console.warn('we are ready :)');
//   });
// });

