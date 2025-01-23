import express from 'express';
import Menu from '../models/Menu.js';

const router = express.Router();


router.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.post('/menu', async (req, res) => {
  const { name, category, price, availability } = req.body;
  if (!name || !category || !price) {
    return res.status(400).send('Name, category, and price are required');
  }

  try {
    const menuItem = new Menu({ name, category, price, availability });
    await menuItem.save();
    res.status(201).json({ message: 'Menu item added', menuItem }); // Return the created menu item
  } catch (error) {
    res.status(500).send('Server error');
  }
});



router.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, availability } = req.body;

  try {
    const menuItem = await Menu.findByIdAndUpdate(id, { name, category, price, availability }, { new: true });
    if (!menuItem) {
      return res.status(404).send('Menu item not found');
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findByIdAndDelete(id);
    if (!menuItem) {
      return res.status(404).send('Menu item not found');
    }
    res.status(204).send('Successfully deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

export default router;