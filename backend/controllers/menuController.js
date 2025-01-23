import Menu from '../models/Menu.js';
const getMenu = async (req, res) => {
    try {
        const menu = await Menu.find();
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
};

const addMenuItem = async (req, res) => {
    const { name, category, price, availability } = req.body;
    if (!name || !category || !price) {
        return res.status(400).json({ error: 'Name, category, and price are required' });
    }

    try {
        const newMenuItem = new Menu({ name, category, price, availability: availability || true });
        await newMenuItem.save();
        res.status(201).json({ message: 'Menu item added', menuItem: newMenuItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add menu item' });
    }
};

const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedMenuItem = await Menu.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item updated', menuItem: updatedMenuItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update menu item' });
    }
};

const deleteMenuItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMenuItem = await Menu.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };