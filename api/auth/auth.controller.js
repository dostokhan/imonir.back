const httpStatus = require('http-status');
const passport = require('passport');

const {
  getSignedToken,
} = require('./auth.util');

const {
  fbUserId,
} = require('../../config/vars');

/**
 * Authenticate User
 * @public
 */
exports.authenticate = async (req, res, next) => {
  console.log(`access_token: ${req.body.access_token}`);

  passport.authenticate('facebook-token', { session: false }, (user) => {
    console.log(user);

    const userIds = fbUserId
      ? fbUserId.split(',')
      : [];
    console.log('valid fb users');
    console.log(userIds);
    console.log(`authorize this fb user: ${user.id}`);

    if (!user || !userIds.includes(user.id)) {
      res.status(httpStatus.BAD_REQUEST, 'User Not Authenticated').end();
    } else {
      const token = getSignedToken({ id: user.id });
      res.status(httpStatus.OK).json({ token });
    }
  })(req, res, next);
};
