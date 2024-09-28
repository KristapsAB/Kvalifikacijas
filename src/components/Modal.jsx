import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

function Modal({ show, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    username: '',
    email: '',
    bio: ''
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-background bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2D2D2D] p-8 rounded-3xl w-11/12 max-w-2xl shadow-custom relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#A3688F] via-[#FFD4F1] to-[#A3688F] animate-gradient"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#FFD4F1] hover:text-[#A3688F] transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-3xl font-bold text-[#FFD4F1] mb-6 font-lexend text-center">Edit Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faPencilAlt} className="absolute top-6 left-4 text-[#A3688F]" />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something in your bio"
              className="p-3 pl-12 w-full h-32 rounded-2xl font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex justify-center items-center space-x-6 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="font-lexend text-[#FFD4F1] font-light text-sm tracking-widest relative group text-center px-6 py-2 rounded-full border-2 border-[#A3688F] hover:bg-[#A3688F] transition-all duration-300"
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="font-lexend text-background font-light text-sm tracking-widest relative group text-center px-6 py-2 rounded-full bg-gradient-to-r from-[#A3688F] to-[#FFD4F1] hover:from-[#FFD4F1] hover:to-[#A3688F] transition-all duration-300"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;