import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <ul className="w-3/4 md:w-1/2 bg-white shadow-lg rounded-lg p-4 space-y-2">
        {orders.map((order) => (
          <li key={order._id} className="flex flex-col md:flex-row justify-between border-b py-2">
            <span>Order ID: {order._id}</span>
            <span>Total Amount: ${order.totalAmount}</span>
            <span>Status: {order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
