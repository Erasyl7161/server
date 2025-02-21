// models/Brand.js
const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Brand', BrandSchema);
