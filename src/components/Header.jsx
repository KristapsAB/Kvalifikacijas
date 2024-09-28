import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const EngFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="10">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const LatFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="10">
    <rect width="50" height="30" fill="#9E3039"/>
    <rect width="50" height="6" y="12" fill="#FFF"/>
  </svg>
);

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('ENG');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleLangMenu = () => {
        setIsLangMenuOpen(!isLangMenuOpen);
    };

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
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-shrink-0">
                        <h1 className="text-lg md:text-xl text-text font-extrabold tracking-wide font-lexend">E-CAPSULE</h1>
                    </div>

                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-text">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <nav className="hidden md:flex items-center justify-center flex-grow">
                        <div className="flex space-x-2 md:space-x-4 lg:space-x-6 text-sm md:text-base font-lexend">
                            <NavItem href="/Home">Home</NavItem>
                            <NavItem href="/Dashboard">Dashboard</NavItem>
                            <NavItem href="/Profile">Profile</NavItem>
                            <NavItem href="/CapsuleCreation">Create Capsule</NavItem>
                            <NavItem href="/Discover">Discover</NavItem>
                        </div>
                    </nav>

                    <div className="hidden md:flex items-center justify-end space-x-2 flex-shrink-0">
                        <div className="relative">
                            <button 
                                onClick={toggleLangMenu}
                                className="text-text bg-secondary font-bold rounded-xl py-1.5 px-3 text-xs md:text-sm flex items-center justify-center"
                            >
                                {currentLang === 'ENG' ? <EngFlag /> : <LatFlag />}
                                <span className="ml-2">{currentLang}</span>
                                <ChevronDown size={16} className="ml-1" />
                            </button>
                            {isLangMenuOpen && (
                                <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <LangButton lang="ENG" flag={EngFlag} />
                                        <LangButton lang="LAT" flag={LatFlag} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={handleLogout} className="text-text bg-secondary rounded-xl py-1.5 px-8 font-bold text-xs md:text-sm">
                            LOGOUT
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav className="mt-4 md:hidden">
                        <div className="flex flex-col font-light space-y-2">
                            <NavItem href="/Home">Home</NavItem>
                            <NavItem href="/Dashboard">Dashboard</NavItem>
                            <NavItem href="/Profile">Profile</NavItem>
                            <NavItem href="/CapsuleCreation">Inventory</NavItem>
                            <NavItem href="/Discover">Capsules</NavItem>
                        </div>
                        <div className="mt-4 flex flex-col space-y-2">
                            <div className="relative">
                                <button 
                                    onClick={toggleLangMenu}
                                    className="text-text bg-secondary w-full rounded-xl py-1 flex items-center justify-center"
                                >
                                    {currentLang === 'ENG' ? <EngFlag /> : <LatFlag />}
                                    <span className="ml-2">{currentLang}</span>
                                    <ChevronDown size={16} className="ml-1" />
                                </button>
                                {isLangMenuOpen && (
                                    <div className="absolute left-0 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <LangButton lang="ENG"  flag={EngFlag} />
                                            <LangButton lang="LAT" flag={LatFlag} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={handleLogout} className="text-text bg-secondary w-full rounded-xl py-1">
                                LOGOUT
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;
