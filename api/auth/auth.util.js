const jwt = require('jsonwebtoken');

const {
  jwtSecret,
} = require('../../config/vars');

const getSignedToken = auth =>
  jwt.sign(
    auth,
    jwtSecret,
    {
      expiresIn: '6h',
    },
  );

module.exports = {
  getSignedToken,
};

