import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Orders from './pages/Orders';

const App = () => {
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
};

export default App;
