import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '', availability: true });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please login.');

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuItems(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to fetch menu items.');
      }
    };
    fetchMenu();
  }, []);

  const handleAddItem = async () => {
    if (isNaN(newItem.price) || newItem.price <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login.');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/menu`,
        newItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMenuItems([...menuItems, response.data.menuItem]);
      setNewItem({ name: '', category: '', price: '', availability: true });
      toast.success('Item added successfully!');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to add item.');
      toast.error(error.response?.data?.message || 'Failed to add item.');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login.');

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(menuItems.filter((item) => item._id !== id));
      toast.success('Item deleted successfully!');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete item.');
      toast.error(error.response?.data?.message || 'Failed to delete item.');
    }
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };

  const handleEditItem = (item) => {
    setEditItem(item);
  };

  const handleUpdateItem = async () => {
    if (isNaN(editItem.price) || editItem.price <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login.');

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/menu/${editItem._id}`,
        editItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedItems = menuItems.map((item) =>
        item._id === editItem._id ? response.data.menuItem : item
      );
      setMenuItems(updatedItems);
      setEditItem(null);
      toast.success('Item updated successfully!');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update item.');
      toast.error(error.response?.data?.message || 'Failed to update item.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 space-y-4 mb-6">
        <h2 className="text-xl font-bold">Add New Item</h2>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={newItem.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <input
          type="text"
          name="category"
          placeholder="Item Category"
          value={newItem.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <input
          type="number"
          name="price"
          placeholder="Item Price"
          value={newItem.price}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          min="0.01" step="0.01"
        />
        <button
          onClick={handleAddItem}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      {editItem && (
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 space-y-4 mb-6">
          <h2 className="text-xl font-bold">Edit Item</h2>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={editItem.name}
            onChange={handleEditChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <input
            type="text"
            name="category"
            placeholder="Item Category"
            value={editItem.category}
            onChange={handleEditChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <input
            type="number"
            name="price"
            placeholder="Item Price"
            value={editItem.price}
            onChange={handleEditChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            min="0.01" step="0.01"
          />
          <button
            onClick={handleUpdateItem}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Update Item
          </button>
          <button
            onClick={() => setEditItem(null)}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-2"
          >
            Cancel
          </button>
        </div>
      )}

      <ul className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 space-y-2">
        {menuItems.length > 0 ? (
          menuItems.map((item) => {
            if (!item || !item._id) return null; // Defensive check
            return (
              <li key={item._id} className="flex justify-between items-center border-b py-2">
                <span>{item.name}</span>
                <span>₹{item.price}</span> {/* Changed to rupee symbol */}
                <div>
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <p>No menu items available.</p>
        )}
      </ul>
    </div>
  );
};

export default Menu;
