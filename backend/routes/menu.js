const express = require('express');
const Menu = require('../models/Menu');

const router = express.Router();

// Get all menu items
router.get('/menu', async (req, res) => {
  const menuItems = await Menu.find();
  res.json(menuItems);
});

// Add a new menu item
router.post('/menu', async (req, res) => {
  const { name, category, price, availability } = req.body;
  if (!name || !category || !price) {
    return res.status(400).send('Name, category, and price are required');
  }

  const menuItem = new Menu({ name, category, price, availability });
  await menuItem.save();
  res.status(201).send('Menu item added');
});

// Update a menu item
router.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, availability } = req.body;

  const menuItem = await Menu.findByIdAndUpdate(id, { name, category, price, availability }, { new: true });
  if (!menuItem) {
    return res.status(404).send('Menu item not found');
  }
  res.json(menuItem);
});

// Delete a menu item
router.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const menuItem = await Menu.findByIdAndDelete(id);
  if (!menuItem) {
    return res.status(404).send('Menu item not found');
  }
  res.status(204).send();
});

module.exports = router;
