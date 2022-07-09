const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, _res, next) => {
  const auth = req.cookies.jwt;

  if (!auth) {
    throw new AuthError('Авторизуйтесь');
  }

  let payload;

  try {
    payload = jwt.verify(auth, 'some-secret-key');
  } catch (err) {
    throw next(new AuthError('Авторизуйтесь'));
  }

  req.user = payload;

  return next();
};
