import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/menu'); // Redirect to the menu page after successful login
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed! Check your credentials.');
      toast.error(errorMessage || 'Login failed! Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Login
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <p className="text-center">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
