const express = require('express');
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(403).send('Access denied');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Place an order
router.post('/order', authMiddleware, async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).send('Items are required');
  }

  let totalAmount = 0;
  for (let i = 0; i < items.length; i++) {
    const menuItem = await Menu.findById(items[i].menuItemId);
    if (!menuItem) {
      return res.status(404).send(`Menu item with ID ${items[i].menuItemId} not found`);
    }
    totalAmount += menuItem.price * items[i].quantity;
  }

  const order = new Order({
    userId: req.userId,
    items,
    totalAmount,
    status: 'Pending'
  });

  await order.save();
  res.status(201).send('Order placed successfully');
});

// Get all orders for the logged-in user
router.get('/orders', authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.userId });
  res.json(orders);
});

module.exports = router;
