// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unauthorized('Токен не предоставлен'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Токен пуст'));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.exp * 1000 < Date.now()) {
      return next(ApiError.unauthorized('Токен истёк, войдите снова'));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Ошибка авторизации: неверный токен'));
  }
};
