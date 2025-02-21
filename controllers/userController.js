// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const ApiError = require('../error/ApiError');
const User = require('../models/User');
const Token = require('../models/Token');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Генерация JWT
const generateJwt = (id, email, role, deviceId) => {
  return jwt.sign(
    { id, email, role, deviceId, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 },
    process.env.SECRET_KEY
  );
};

const validateEmail = (email) => {
  return email && typeof email === 'string' && email.includes('@');
};

class UserController {
  // Регистрация
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!validateEmail(email) || !password) {
        return next(ApiError.badRequest('Некорректный email или пароль'));
      }

      const candidate = await User.findOne({ email });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь уже существует'));
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;

      const user = await User.create({
        email,
        password: hashPassword,
        otpsecret: otpSecret
      });

      // Генерируем QR-код для 2FA
      const otpauthUrl = speakeasy.otpauthURL({
        secret: otpSecret,
        label: email,
        issuer: 'MyApp'
      });
      const qrCode = await qrcode.toDataURL(otpauthUrl);

      return res.json({ message: 'Регистрация успешна', user, qrCode });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return next(ApiError.internal('Ошибка при регистрации пользователя'));
    }
  }

  // Логин (отправляем OTP по email)
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!validateEmail(email)) {
        return next(ApiError.badRequest('Некорректный email'));
      }

      const user = await User.findOne({ email });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest('Неверный пароль'));
      }

      // Генерация одноразового пароля (OTP)
      const otp = speakeasy.totp({
        secret: user.otpsecret,
        encoding: 'base32'
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP-код',
        text: `Ваш код: ${otp}`
      });

      return res.json({ message: 'OTP-код отправлен' });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return next(ApiError.internal('Ошибка при входе'));
    }
  }

  // Подтверждаем OTP и выдаём JWT
  async verifyOtp(req, res, next) {
    try {
      const { email, otp, deviceId } = req.body;
      if (!validateEmail(email)) {
        return next(ApiError.badRequest('Некорректный email'));
      }

      const user = await User.findOne({ email });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      const verified = speakeasy.totp.verify({
        secret: user.otpsecret,
        encoding: 'base32',
        token: otp,
        window: 2
      });
      if (!verified) {
        return next(ApiError.badRequest('Неверный OTP-код'));
      }

      // Удаляем старые токены
      await Token.deleteMany({ userId: user._id });

      // Создаём новый
      const token = generateJwt(user._id, user.email, user.role, deviceId);
      await Token.create({ userId: user._id, token, deviceId });

      return res.json({ token });
    } catch (error) {
      console.error('Ошибка в verifyOtp:', error);
      return next(ApiError.internal('Ошибка при подтверждении OTP'));
    }
  }

  // Профиль
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id, {
        email: 1,
        role: 1,
        createdAt: 1
      });
      if (!user) {
        return next(ApiError.notFound('Пользователь не найден'));
      }
      return res.json(user);
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      return next(ApiError.internal('Ошибка при получении профиля'));
    }
  }

  // Проверка токена
  async check(req, res, next) {
    try {
      const { id, email, role, deviceId } = req.user;
      const tokenExists = await Token.findOne({ userId: id, deviceId });
      if (!tokenExists) {
        return next(ApiError.unauthorized('Токен не найден или устарел'));
      }
      return res.json({ id, email, role });
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return next(ApiError.internal('Ошибка при проверке авторизации'));
    }
  }

  // Выход (удаляем текущий токен)
  async logout(req, res, next) {
    try {
      const { token } = req.body;
      if (!token) {
        return next(ApiError.badRequest('Токен обязателен'));
      }

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return next(ApiError.badRequest('Токен не найден или уже удалён'));
      }

      await Token.deleteOne({ token });

      return res.json({ message: 'Вы успешно вышли' });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      return next(ApiError.internal('Ошибка при выходе'));
    }
  }
}

module.exports = new UserController();
