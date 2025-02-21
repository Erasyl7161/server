// controllers/basketController.js
const Basket = require('../models/Basket');
const BasketDevice = require('../models/BasketDevice');
const Device = require('../models/Device');
const ApiError = require('../error/ApiError');

class BasketController {
  // Получить все устройства в корзине
  async getBasket(req, res, next) {
    try {
      const userId = req.user.id;

      // Ищем/создаём корзину
      let basket = await Basket.findOne({ userId });
      if (!basket) {
        basket = await Basket.create({ userId });
      }

      // Находим все записи BasketDevice + подтягиваем данные Device
      const basketDevices = await BasketDevice.find({ basketId: basket._id })
        .populate('deviceId');

      return res.json(basketDevices);
    } catch (error) {
      console.error('Ошибка при получении корзины:', error);
      return next(ApiError.internal('Ошибка при получении корзины'));
    }
  }

  // Добавить устройство в корзину
  async addDevice(req, res, next) {
    try {
      const userId = req.user.id;
      const { deviceId } = req.body;
      if (!deviceId) {
        return next(ApiError.badRequest('deviceId обязателен'));
      }

      let basket = await Basket.findOne({ userId });
      if (!basket) {
        basket = await Basket.create({ userId });
      }

      const basketDevice = await BasketDevice.create({
        basketId: basket._id,
        deviceId
      });

      return res.json(basketDevice);
    } catch (error) {
      console.error('Ошибка при добавлении устройства в корзину:', error);
      return next(ApiError.internal('Ошибка при добавлении устройства в корзину'));
    }
  }

  // Удалить конкретный basketDevice
  async removeDevice(req, res, next) {
    try {
      const userId = req.user.id;
      const { basketDeviceId } = req.params;

      const basket = await Basket.findOne({ userId });
      if (!basket) {
        return next(ApiError.badRequest('Корзина не найдена'));
      }

      const basketDevice = await BasketDevice.findOne({
        _id: basketDeviceId,
        basketId: basket._id
      });
      if (!basketDevice) {
        return next(ApiError.badRequest('Товар не найден в корзине'));
      }

      await basketDevice.deleteOne();
      return res.json({ message: 'Товар удалён из корзины' });
    } catch (error) {
      console.error('Ошибка при удалении устройства из корзины:', error);
      return next(ApiError.internal('Ошибка при удалении устройства из корзины'));
    }
  }

  // Очистить корзину
  async clearBasket(req, res, next) {
    try {
      const userId = req.user.id;
      const basket = await Basket.findOne({ userId });
      if (!basket) {
        return next(ApiError.badRequest('Корзина не найдена'));
      }

      await BasketDevice.deleteMany({ basketId: basket._id });
      return res.json({ message: 'Корзина очищена' });
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error);
      return next(ApiError.internal('Ошибка при очистке корзины'));
    }
  }

  // Пример агрегирования (для отчёта)
  async getBasketStats(req, res, next) {
    try {
      const userId = req.user.id;
      const basket = await Basket.findOne({ userId });
      if (!basket) {
        return next(ApiError.badRequest('Корзина не найдена'));
      }

      // Пример агрегации: считаем общее количество товаров и суммарную стоимость
      const stats = await BasketDevice.aggregate([
        { $match: { basketId: basket._id } },
        {
          $lookup: {
            from: 'devices', // название коллекции (строчные, т.к. mongoose создаёт 'devices' из Device)
            localField: 'deviceId',
            foreignField: '_id',
            as: 'deviceData'
          }
        },
        { $unwind: '$deviceData' },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalPrice: { $sum: '$deviceData.price' }
          }
        }
      ]);

      return res.json({ stats });
    } catch (error) {
      console.error('Ошибка при агрегировании корзины:', error);
      return next(ApiError.internal('Ошибка при агрегировании корзины'));
    }
  }
}

module.exports = new BasketController();
