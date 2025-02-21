// controllers/deviceController.js
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const ApiError = require('../error/ApiError');
const Device = require('../models/Device');
const DeviceInfo = require('../models/DeviceInfo');
const mvAsync = promisify(fs.rename); // Для перемещения файла (или используем file.mv из fileUpload)

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;

      // Генерируем уникальное имя
      const fileName = uuid.v4() + '.jpg';
      const uploadPath = path.resolve(__dirname, '..', 'static', fileName);

      // Перемещаем файл
      await img.mv(uploadPath);

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName
      });

      if (info) {
        info = JSON.parse(info);
        for (const i of info) {
          await DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device._id
          });
        }
      }

      return res.json(device);
    } catch (error) {
      console.error('Ошибка при создании устройства:', error);
      return next(ApiError.badRequest(error.message));
    }
  }async explainQuery(req, res, next) {
        try {
            const query = req.body.query;
            if (!query) {
                return res.status(400).json({ message: "Отсутствует query" });
            }

            // Используем explain() для анализа запроса
            const result = await Device.find(query).explain("executionStats");
            return res.json(result);
        } catch (error) {
            console.error("Ошибка в explainQuery:", error);
            return res.status(500).json({ message: "Ошибка при выполнении explainQuery" });
        }
    }
    async explainQuery(req, res, next) {
      try {
          const query = req.body.query;
          if (!query) {
              return res.status(400).json({ message: "Отсутствует query" });
          }

          // Используем explain() для анализа запроса
          const result = await Device.find(query).explain("executionStats");
          return res.json(result);
      } catch (error) {
          console.error("Ошибка в explainQuery:", error);
          return res.status(500).json({ message: "Ошибка при выполнении explainQuery" });
      }
  }
  async getAll(req, res, next) {
    try {
      let { brandId, typeId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 9;
      const offset = (page - 1) * limit;

      let filter = {};
      if (brandId) filter.brandId = brandId;
      if (typeId) filter.typeId = typeId;

      // Считаем общее кол-во для пагинации
      const totalCount = await Device.countDocuments(filter);

      // Получаем ограниченную выборку
      const devices = await Device.find(filter)
        .skip(offset)
        .limit(Number(limit));

      return res.json({
        count: totalCount,
        rows: devices
      });
    } catch (error) {
      console.error('Ошибка при получении устройств:', error);
      return next(ApiError.internal('Ошибка при получении устройств'));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.findById(id).populate({
        path: 'brandId typeId',
        select: 'name' // Если хотим взять только поле name
      });

      if (!device) {
        return next(ApiError.notFound('Устройство не найдено'));
      }

      // Подтягиваем DeviceInfo
      const deviceInfo = await DeviceInfo.find({ deviceId: device._id });

      return res.json({ ...device.toObject(), info: deviceInfo });
    } catch (error) {
      console.error('Ошибка при получении устройства:', error);
      return next(ApiError.internal('Ошибка при получении устройства'));
    }
  }
  async deleteDevice(req, res, next) {
    try {
        const { id } = req.params;
        const deletedDevice = await Device.findByIdAndDelete(id);

        if (!deletedDevice) {
            return res.status(404).json({ message: "Устройство не найдено" });
        }

        return res.json({ message: "Устройство удалено" });
    } catch (error) {
        return next(ApiError.internal("Ошибка при удалении устройства"));
    }
}

  async updateDevice(req, res, next) {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const updatedDevice = await Device.findByIdAndUpdate(
            id,
            { name, price },
            { new: true }
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: "Устройство не найдено" });
        }

        return res.json(updatedDevice);
    } catch (error) {
        return next(ApiError.internal("Ошибка при обновлении устройства"));
    }
    
}

}

module.exports = new DeviceController();
