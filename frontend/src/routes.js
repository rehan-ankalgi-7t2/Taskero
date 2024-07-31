import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board" element={<Board />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;