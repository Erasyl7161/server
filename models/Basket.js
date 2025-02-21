// models/Basket.js
const mongoose = require('mongoose');

const BasketSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Basket', BasketSchema);
