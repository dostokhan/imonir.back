const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ?
  '../.env.production' :
  '../.env.development';

// console.log('env file' + envFile);
dotenv.load({ path: path.join(__dirname, envFile) });


// import .env variables
// require('dotenv-safe').load({
//   path: path.join(__dirname, '../../.env'),
//   sample: path.join(__dirname, '../../.env.example'),
// });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  fbClientId: process.env.FACEBOOK_CLIENTID,
  fbClientSecret: process.env.FACEBOOK_CLIENTSECRET,
  corsOrigin: process.env.CORS_ORIGIN,
  authUser: process.env.HTTP_AUTH_USER,
  authPassword: process.env.HTTP_AUTH_PASSWORD,
  fbUserId: process.env.FACEBOOK_USERID,
  // jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  // mongo: {
  //   uri: process.env.NODE_ENV === 'test'
  //     ? process.env.MONGO_URI_TESTS
  //     : process.env.MONGO_URI,
  // },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
