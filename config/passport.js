const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const jwt = require('jsonwebtoken');


/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: '/auth/github/callback',
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  if (profile._json.email === 'dostokhan@gmail.com') {
    // successfull login
    const payload = {
      githubId: profile.id,
    };

    // create a token string
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const data = {
      sub: profile.displayName,
    };

    return done(null, token, data);
  } else {
    // not dostokhan so login fails
    done(false);
  }
  // const user = new User();
  // user.email = profile._json.email;
  // user.github = profile.id;
  // user.tokens.push({ kind: 'github', accessToken });
  // user.profile.name = profile.displayName;
  // user.profile.picture = profile._json.avatar_url;
  // user.profile.location = profile._json.location;
  // user.profile.website = profile._json.blog;
  // user.save((err) => {
  //   done(err, user);
  // });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

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
