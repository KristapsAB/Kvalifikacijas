import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPencilAlt, faTimes, faLock, faEye } from '@fortawesome/free-solid-svg-icons';

function Modal({ show, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    firstName: '', 
    lastName: '',
    email: '',
    bio: '',
    image: null,
    newPassword: '',
    confirmNewPassword: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        setErrors(prev => ({ ...prev, password: "New passwords do not match" }));
        return;
      }
    }
    setErrors({});
    console.log("Form Submitted with Data:", formData);
    setIsConfirming(true);
  }, [formData]);

  const handleConfirm = useCallback(async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('confirmPassword', confirmPassword);
    if (formData.newPassword) {
      formDataToSend.append('newPassword', formData.newPassword);
    }
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token:', token);
  
      const response = await fetch('http://127.0.0.1:8000/api/update-profile', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || data.message || `Error: ${response.statusText}`);
      }
  
      console.log('Profile updated:', data);
      setSuccessMessage('Profile updated successfully!');
      onSave(data.user);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      setErrors(prevErrors => ({ ...prevErrors, general: error.message }));
      setIsConfirming(false);
    }
  }, [formData, confirmPassword, onSave, onClose]);

  const handleConfirmSubmit = useCallback((e) => {
    e.preventDefault();
    handleConfirm();
  }, [handleConfirm]);

  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

  if (!show) return null;

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

        {isConfirming ? (
          <form onSubmit={handleConfirmSubmit} className="space-y-6">
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]"
              />
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your current password"
                className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
              />
            </div>

            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                type="submit"
                className="font-lexend text-background font-light text-sm tracking-widest relative group text-center px-6 py-2 rounded-full bg-gradient-to-r from-[#A3688F] to-[#FFD4F1] hover:from-[#FFD4F1] hover:to-[#A3688F] transition-all duration-300"
              >
                CONFIRM CHANGES
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center">
                <label className="cursor-pointer mb-2">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    <div className="w-32 h-32 border-2 border-[#A3688F] rounded-full flex items-center justify-center text-[#A3688F]">
                      <span>Select Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name Fields */}
              <div className="flex flex-col w-full space-y-6">
                {/* First Name Field */}
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter Your First Name"
                    className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
                  />
                </div>

                {/* Last Name Field */}
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                    className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
              />
            </div>

            {/* Bio Field */}
            <div className="relative">
              <FontAwesomeIcon icon={faPencilAlt} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="p-3 pl-12 w-full h-32 rounded-xl font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A3688F] cursor-pointer"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#A3688F]" />
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className="p-3 pl-12 w-full rounded-full font-light tracking-wide font-lexend bg-[#1E1E1E] text-[#FFD4F1] text-base border-2 border-[#A3688F] focus:border-[#FFD4F1] outline-none placeholder-[#FFD4F1] placeholder-opacity-50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                type="submit"
                className="font-lexend text-background font-light text-sm tracking-widest relative group text-center px-6 py-2 rounded-full bg-gradient-to-r from-[#A3688F] to-[#FFD4F1] hover:from-[#FFD4F1] hover:to-[#A3688F] transition-all duration-300"
              >
                SAVE CHANGES
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Modal;
