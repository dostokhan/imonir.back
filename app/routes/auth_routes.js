const passport = require('passport');
const jwt = require('jsonwebtoken');

const createToken = payload =>
  (
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
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
        console.log(user);

        if (!user || user.id !== process.env.FACEBOOK_USERID) {
          return res.send(401, 'User Not Authenticated');
        }

        // prepare token for API
        req.auth = {
          id: user.id, // req.user.id
        };

        next();
      })(req, res, next);
    }, generateToken, sendToken);
};
