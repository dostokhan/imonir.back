const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
// const MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');
// const db = require('./config/db');
//
dotenv.load({ path: 'config/.env.development' });

const server = express();
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

server.use(bodyParser.urlencoded({ extended: true }));


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

