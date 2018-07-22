const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
// const methodOverride = require('method-override');
// INSTALL THESE
// const helmet = require('helmet');
// INSTALL END

const routes = require('../api/routes/v1');
const {
  corsOrigin,
} = require('./vars');

// discard below line and uncomment following line
require('./passport');
// const strategies = require('./passport');

// create express server
const server = express();

// request logging. dev: console | production: file
server.use(morgan('combined'));

// parse body params and attache them to req.body
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// cookie par
server.use(cookieParser());
server.disable('x-powered-by');

// gzip compression
server.use(compression());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
// server.use(methodOverride());


// secure apps by setting various HTTP headers
// server.use(helmet());

// enable CORS - Cross Origin Resource Sharing
server.use(
  cors({
    origin(origin, cb) {
      const whitelist = corsOrigin
        ? corsOrigin.split(',')
        : [];
      cb(null, whitelist.includes(origin));
    },
    methods: 'GET, POST, PATCH, DELETE',
    // exposeHeaders: ['mj-token'],
    credentials: true,
  }),
);

// enable authentication
server.use(passport.initialize());
// passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);


server.use('/v1', routes);

module.exports = server;

