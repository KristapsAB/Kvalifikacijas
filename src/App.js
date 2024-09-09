import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, Key, Clock } from 'lucide-react';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(true);
    // Here you would normally handle the actual login/register logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 font-['Orbitron']">
      <div className={`bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-1000 ${isOpen ? 'scale-110' : ''}`}>
        <div className="p-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 animate-gradient"></div>
          
          <div className="text-center mb-8">
            <div className={`w-40 h-40 mx-auto border-8 border-yellow-500 rounded-full flex items-center justify-center transition-all duration-1000 ${isOpen ? 'rotate-[720deg] scale-90' : ''}`}>
              <div className="relative w-full h-full">
                <Clock className="absolute inset-0 m-auto text-yellow-500 animate-pulse" size={48} />
                <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-spin-slow"></div>
              </div>
            </div>
            <h2 className="mt-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500">Time Vault</h2>
            <p className="text-gray-400 mt-2">{isLogin ? 'Access your memories' : 'Secure your future'}</p>
            <p className="text-sm text-yellow-500 mt-1">{currentTime}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <input
                  className="w-full bg-gray-700 text-gray-200 border-2 border-gray-600 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-yellow-500 transition-all duration-300"
                  type="text"
                  placeholder="Choose a username"
                />
                <User className="absolute left-3 top-2.5 text-gray-500" size={20} />
              </div>
            )}
            
            <div className="relative">
              <input
                className="w-full bg-gray-700 text-gray-200 border-2 border-gray-600 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-yellow-500 transition-all duration-300"
                type="email"
                placeholder="Your email address"
              />
              <Mail className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>
            
            <div className="relative">
              <input
                className="w-full bg-gray-700 text-gray-200 border-2 border-gray-600 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-yellow-500 transition-all duration-300"
                type="password"
                placeholder="••••••••"
              />
              <Key className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>
            
            <button
              className="w-full bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              type="submit"
            >
              {isLogin ? 'Unlock Vault' : 'Seal Your Vault'}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-700 px-8 py-4">
          <p className="text-center text-gray-400 text-sm">
            {isLogin ? "Don't have a vault? " : "Already have a vault? "}
            <button
              className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors duration-300"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Create one' : 'Access it'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;