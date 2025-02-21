// routes/userRouter.js
const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);

router.get('/auth', authMiddleware, userController.check);
router.get('/profile', authMiddleware, userController.getProfile);

// POST для OTP
router.post('/verify-otp', userController.verifyOtp);

module.exports = router;
