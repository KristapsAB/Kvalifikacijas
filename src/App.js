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

function App() {
  const location = useLocation();
  
  const currentPath = location.pathname.toLowerCase().replace(/\/+$/, ''); 

  return (
    <div>
      {currentPath !== '/login' && currentPath !== '/register' && <Header />}
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CapsuleCreation" element={<CapsuleCreation />} />
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
