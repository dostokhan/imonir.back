const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');


/**
 * Sign in with Facebook for REST API.
 */
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_CLIENTID,
  clientSecret: process.env.FACEBOOK_CLIENTSECRET,
},
(accessToken, refreshToken, profile, done) => {
  return done(profile);
  // User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
  //   return done(err, user);
  // });
}));

/**
 * Login Required middleware.
 */
// exports.isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// };

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
