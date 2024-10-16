import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CapsuleCreation from './pages/CapsuleCreation';
import Friends from './pages/FindFriends';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase().replace(/\/+$/, '');

  return (
    <div>
      <Toaster position="top-right" />
      {currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/email-verification' && <Header />}
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CapsuleCreation" element={<CapsuleCreation />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}