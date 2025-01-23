import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderItems, setOrderItems] = useState([{ menuItemId: '', quantity: 1 }]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please login.');

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to fetch orders.');
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`);
        setMenuItems(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to fetch menu items.');
      }
    };

    fetchOrders();
    fetchMenuItems();
  }, []);

  const handleInputChange = (index, e) => {
    const values = [...orderItems];
    values[index][e.target.name] = e.target.value;
    setOrderItems(values);
  };

  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, { menuItemId: '', quantity: 1 }]);
  };

  const handleRemoveOrderItem = (index) => {
    const values = [...orderItems];
    values.splice(index, 1);
    setOrderItems(values);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login.');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order`,
        { items: orderItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders([...orders, response.data.order]);
      toast.success('Order placed successfully!');
      setOrderItems([{ menuItemId: '', quantity: 1 }]);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to place order.');
      toast.error(error.response?.data?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 space-y-4 mb-6">
        <h2 className="text-xl font-bold">Place New Order</h2>
        {orderItems.map((item, index) => (
          <div key={index} className="flex flex-wrap space-x-4 mb-4 items-center">
            <select
              name="menuItemId"
              value={item.menuItemId}
              onChange={(e) => handleInputChange(index, e)}
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Item</option>
              {menuItems.map((menuItem) => (
                <option key={menuItem._id} value={menuItem._id}>
                  {menuItem.name} - ₹{menuItem.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(index, e)}
              className="w-24 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <button
              type="button"
              onClick={() => handleRemoveOrderItem(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOrderItem}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4"
        >
          Add Item
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Place Order
        </button>
      </div>

      <ul className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 space-y-2">
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order._id} className="flex flex-col md:flex-row justify-between border-b py-2">
              <div className="flex flex-col space-y-2">
                <span>Order ID: {order._id}</span>
                <span>Total Amount: ₹{order.totalAmount}</span>
                <span>Status: {order.status}</span>
              </div>
              <div className="flex flex-col mt-2 md:mt-0">
                <h3 className="text-lg font-bold">Items:</h3>
                <ul className="list-disc ml-4">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {menuItems.find((menuItem) => menuItem._id === item.menuItemId)?.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </ul>
    </div>
  );
};

export default Orders;