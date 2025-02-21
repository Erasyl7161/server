// models/Type.js
const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Type', TypeSchema);
