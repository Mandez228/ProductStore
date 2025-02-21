// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cartItems: { type: Array, required: true }, // Скопированный массив пользователя
    username: { type: String, required: true }, // Если есть пользователь
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);