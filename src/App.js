import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CapsuleCreation from './pages/CapsuleCreation';
import Friends from './pages/FindFriends';
import NotificationSidebar from './components/NotificationSidebar';
import CapsuleAcceptModal from './components/CapsuleAcceptModal';
import { Toaster } from 'react-hot-toast';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase().replace(/\/+$/, '');
  const shouldShowHeader = !['/login', '/register', '/email-verification'].includes(currentPath);
  
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  const handleCapsuleAccept = useCallback((capsuleData) => {
    console.log('Opening modal with capsule:', capsuleData);
    setSelectedCapsule(capsuleData);
    setIsAcceptModalOpen(true);
    setIsNotificationSidebarOpen(false);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Toaster position="top-right" />
      {shouldShowHeader && (
        <Header
          notificationCount={notificationCount}
          onNotificationClick={() => setIsNotificationSidebarOpen(true)}
        />
      )}
      
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CapsuleCreation" element={<CapsuleCreation />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
      
      <NotificationSidebar
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
        onUpdateCount={setNotificationCount}
        onCapsuleAccept={handleCapsuleAccept}
      />
      
      {isAcceptModalOpen && selectedCapsule && (
        <CapsuleAcceptModal
          isOpen={isAcceptModalOpen}
          onClose={() => {
            setIsAcceptModalOpen(false);
            setSelectedCapsule(null);
          }}
          capsule={selectedCapsule}
          onAcceptComplete={() => {
            setIsAcceptModalOpen(false);
            setSelectedCapsule(null);
          }}
        />
      )}
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