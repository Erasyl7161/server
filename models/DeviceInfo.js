// models/DeviceInfo.js
const mongoose = require('mongoose');

const DeviceInfoSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DeviceInfo', DeviceInfoSchema);
