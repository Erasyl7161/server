// controllers/brandController.js
const Brand = require('../models/Brand');
const ApiError = require('../error/ApiError');

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (error) {
      console.error('Ошибка при создании бренда:', error);
      return next(ApiError.internal('Ошибка при создании бренда'));
    }
  }

  async getAll(req, res, next) {
    try {
      const brands = await Brand.find();
      return res.json(brands);
    } catch (error) {
      console.error('Ошибка при получении брендов:', error);
      return next(ApiError.internal('Ошибка при получении брендов'));
    }
  }
}

module.exports = new BrandController();
