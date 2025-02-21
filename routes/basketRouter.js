// routes/basketRouter.js
const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

// Получить корзину пользователя
router.get('/', authMiddleware, basketController.getBasket);

// Добавить устройство
router.post('/', authMiddleware, basketController.addDevice);

// Удалить одно устройство по ID записи
router.delete('/:basketDeviceId', authMiddleware, basketController.removeDevice);

// Очистить корзину
router.delete('/', authMiddleware, basketController.clearBasket);

// Пример: получение статистики по корзине (агрегация)
router.get('/stats', authMiddleware, basketController.getBasketStats);

module.exports = router;
