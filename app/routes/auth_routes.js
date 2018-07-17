const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  jwtSecret,
  fbUserId,
} = require('../../config/vars');


const createToken = payload =>
  (
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: '1h',
      },
    )
  );

const generateToken = (req, res, next) => {
  req.token = createToken(req.auth);
  next();
};

const sendToken = (req, res) => {
  console.log(`jwt: ${req.token}`);
  // res.setHeader('mj-token', req.token);
  res.status(200).send({ token: req.token });
};

module.exports = (server) => {
  server.route('/auth/facebook')
    .post((req, res, next) => {
      console.log(`access_token: ${req.body.access_token}`);

      // res.status(200).send({ oka: 'bye' });
      // next();
      passport.authenticate('facebook-token', { session: false }, (user) => {
        console.log(user.id);

        console.log(fbUserId);
        const fbUsers = fbUserId ? fbUserId.split(',') : [];
        console.log(fbUsers);
        if (!user || !fbUsers.includes(user.id)) {
          return res.send(401, { msg: 'User Not Authenticated' });
        }

        // prepare token for API
        req.auth = {
          id: user.id, // req.user.id
        };

        next();
      })(req, res, next);
    }, generateToken, sendToken);
};
