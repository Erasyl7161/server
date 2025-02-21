// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'USER' },
  otpsecret: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
