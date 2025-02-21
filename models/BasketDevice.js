// models/BasketDevice.js
const mongoose = require('mongoose');

const BasketDeviceSchema = new mongoose.Schema({
  basketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Basket',
    required: true
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  }
}, { timestamps: true });

// пример индекса, чтобы запретить дублирование одной пары basketId-deviceId
// BasketDeviceSchema.index({ basketId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model('BasketDevice', BasketDeviceSchema);
