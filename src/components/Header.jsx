import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import NotificationSidebar from '../components/NotificationSidebar';

// Flag components remain unchanged
const EngFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="10">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const LatFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="10">
    <rect width="50" height="30" fill="#9E3039" />
    <rect width="50" height="6" y="12" fill="#FFF" />
  </svg>
);

function Header() {
  // States remain unchanged
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('ENG');
  const [friendRequestCount, setFriendRequestCount] = useState(() => {
    const storedCount = localStorage.getItem('friendRequestCount');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch function remains unchanged
  const fetchFriendRequestCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/friends/requests/count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFriendRequestCount(data.count);
        localStorage.setItem('friendRequestCount', data.count);
        if (!isInitialized) setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error fetching friend request count:', error);
    }
  }, [isInitialized]);

  useEffect(() => {
    fetchFriendRequestCount();
  }, []); 

  useEffect(() => {
    if (!isInitialized) return;
    const intervalId = setInterval(fetchFriendRequestCount, 30000);
    return () => clearInterval(intervalId);
  }, [fetchFriendRequestCount, isInitialized]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);
  const toggleNotificationSidebar = () => setIsNotificationSidebarOpen(!isNotificationSidebarOpen);
  
  const changeLang = (lang) => {
    setCurrentLang(lang);
    setIsLangMenuOpen(false);
  };

  const LangButton = ({ lang, flag: Flag }) => (
    <button
      onClick={() => changeLang(lang)}
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
    >
      <Flag />
      <span className="ml-2">{lang}</span>
    </button>
  );

  const NavItem = ({ href, children }) => (
    <a href={href} className="text-text relative group text-l font-light">
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out"></span>
    </a>
  );

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <header className="w-full bg-background p-2 md:p-4 font-lexend">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Made more responsive */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-lg md:text-xl text-text font-extrabold tracking-wide font-lexend whitespace-nowrap">
              E-CAPSULE
            </h1>
          </div>

          {/* Mobile Menu Button - Improved positioning */}
          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={toggleNotificationSidebar}
              className="p-1.5 relative"
            >
              <Bell size={20} color='#FFFFFF' />
              {isInitialized && friendRequestCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {friendRequestCount}
                </span>
              )}
            </button>
            <button onClick={toggleMenu} className="text-text p-1.5">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation - Improved spacing */}
          <nav className="hidden md:flex items-center justify-center flex-grow px-4">
            <div className="flex flex-wrap justify-center space-x-2 md:space-x-4 lg:space-x-6 text-sm md:text-base font-lexend">
              <NavItem href="/Home">Home</NavItem>
              <NavItem href="/Dashboard">Dashboard</NavItem>
              <NavItem href="/Profile">Profile</NavItem>
              <NavItem href="/CapsuleCreation">Create Capsule</NavItem>
              <NavItem href="/Friends">Discover</NavItem>
            </div>
          </nav>

          {/* Desktop Actions - Better responsive layout */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={toggleLangMenu}
                className="text-text bg-secondary font-bold rounded-xl py-1.5 px-3 text-xs md:text-sm flex items-center whitespace-nowrap"
              >
                {currentLang === 'ENG' ? <EngFlag /> : <LatFlag />}
                <span className="ml-2">{currentLang}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <LangButton lang="ENG" flag={EngFlag} />
                    <LangButton lang="LAT" flag={LatFlag} />
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="text-text bg-secondary rounded-xl py-1.5 px-4 sm:px-8 font-bold text-xs md:text-sm whitespace-nowrap">
              LOGOUT
            </button>

            {/* Notification Button */}
            <button 
              onClick={toggleNotificationSidebar} 
              className="text-text rounded-xl py-1.5 px-3 font-bold text-xs md:text-sm flex items-center relative"
            >
              <Bell size={20} color='#FFFFFF' />
              {isInitialized && friendRequestCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {friendRequestCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Improved layout and spacing */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4 font-light">
              <NavItem href="/Home">Home</NavItem>
              <NavItem href="/Dashboard">Dashboard</NavItem>
              <NavItem href="/Profile">Profile</NavItem>
              <NavItem href="/CapsuleCreation">Create Capsule</NavItem>
              <NavItem href="/Friends">Discover</NavItem>
              
              <div className="pt-4 flex flex-col space-y-3">
                <button 
                  onClick={toggleLangMenu}
                  className="text-text bg-secondary w-full rounded-xl py-2 flex items-center justify-center"
                >
                  {currentLang === 'ENG' ? <EngFlag /> : <LatFlag />}
                  <span className="ml-2">{currentLang}</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                <button onClick={handleLogout} className="text-text bg-secondary w-full rounded-xl py-2">
                  LOGOUT
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>

      <NotificationSidebar 
        isOpen={isNotificationSidebarOpen} 
        onClose={() => setIsNotificationSidebarOpen(false)}
        onUpdateCount={setFriendRequestCount}
        fetchFriendRequestCount={fetchFriendRequestCount}
      />
    </header>
  );
}

export default Header;