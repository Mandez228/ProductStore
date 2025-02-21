const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/order');
const createPath = require('../helper/create-path');

router.get('/create-order', async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.username }).populate('products.product');
    const cartItems = cart.products;
    res.render(createPath('order-form'), { cartItems });
});

router.post('/create-order', async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;

        const username = req.session.username;
        const cart = await Cart.findOne({ user: req.session.username }).populate('products.product');

        const cartItems = cart.products;

        if (cartItems.length === 0) {
            return res.status(400).send('Cart is empty.');
        }

        const order = new Order({
            firstName,
            lastName,
            phone,
            address,
            cartItems,
            username
        });
        await order.save();

        cart.products = [];
        await cart.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error, please try again later.');
    }
});

module.exports = router;