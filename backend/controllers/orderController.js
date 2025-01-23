import Order from '../models/Order.js';
import Menu from '../models/Menu.js';

const placeOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order items are required' });
    }

    try {
      
        const menuItems = await Menu.find({ _id: { $in: items.map(item => item.id) } });
        let totalAmount = 0;

        items.forEach(orderItem => {
            const menuItem = menuItems.find(item => item.id === orderItem.id);
            if (menuItem) {
                totalAmount += menuItem.price * orderItem.quantity;
            }
        });

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            status: 'Pending',
            createdAt: new Date(),
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to place order' });
    }
};

const getOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.find({ userId }).populate('items.id', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

module.exports = { placeOrder, getOrders };
