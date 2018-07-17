const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const {
  fbClientId,
  fbClientSecret,
} = require('./vars');


passport.use(new FacebookTokenStrategy({
  clientID: fbClientId,
  clientSecret: fbClientSecret,
  enableProof: true,
},
(accessToken, refreshToken, profile, done) => {
  return done(profile);
}));

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(t => t.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};



// const JwtStrategy = require('passport-jwt').Strategy;
// const BearerStrategy = require('passport-http-bearer');
// const { ExtractJwt } = require('passport-jwt');
// const { jwtSecret } = require('./vars');
// const authProviders = require('../api/services/authProviders');
// const User = require('../api/models/user.model');

// const jwtOptions = {
//   secretOrKey: jwtSecret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
// };

// const jwt = async (payload, done) => {
//   try {
//     const user = await User.findById(payload.sub);
//     if (user) return done(null, user);
//     return done(null, false);
//   } catch (error) {
//     return done(error, false);
//   }
// };

// const oAuth = service => async (token, done) => {
//   try {
//     const userData = await authProviders[service](token);
//     const user = await User.oAuthLogin(userData);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };

// exports.jwt = new JwtStrategy(jwtOptions, jwt);
// exports.facebook = new BearerStrategy(oAuth('facebook'));
// exports.google = new BearerStrategy(oAuth('google'));
