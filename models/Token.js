// models/Token.js
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  deviceId: { type: String, required: true }
}, { timestamps: true });

// при желании можно реализовать флаг soft-delete вместо paranoid
module.exports = mongoose.model('Token', TokenSchema);
