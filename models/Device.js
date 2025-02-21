// models/Device.js
const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  img: { type: String, required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
