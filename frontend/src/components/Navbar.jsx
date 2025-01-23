import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/menu" className="text-white hover:text-gray-400">Menu</Link>
        <Link to="/orders" className="text-white hover:text-gray-400">Orders</Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
