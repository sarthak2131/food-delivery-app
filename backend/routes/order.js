import express from 'express';
import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

router.post('/order', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required to place an order.' });
    }

    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.userId,
      items,
      totalAmount,
      status: 'Pending',
    });

    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order.', error: err.message });
  }
});

router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.', error: err.message });
  }
});

export default router;
