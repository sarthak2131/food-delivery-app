import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/menu', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data);
    };
    fetchMenu();
  }, []);

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
