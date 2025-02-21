// controllers/typeController.js
const Type = require('../models/Type');
const ApiError = require('../error/ApiError');

class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const type = await Type.create({ name });
      return res.json(type);
    } catch (error) {
      console.error('Ошибка при создании типа:', error);
      return next(ApiError.internal('Ошибка при создании типа'));
    }
  }

  async getAll(req, res, next) {
    try {
      const types = await Type.find();
      return res.json(types);
    } catch (error) {
      console.error('Ошибка при получении типов:', error);
      return next(ApiError.internal('Ошибка при получении типов'));
    }
  }
}

module.exports = new TypeController();
