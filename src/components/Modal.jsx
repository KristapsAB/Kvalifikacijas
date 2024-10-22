import React, { useState, useCallback, useRef, forwardRef, useEffect } from 'react';
import { Card } from './Card';
import { validateProfileForm } from './validations/ProfileValidations';
import { 
  User, 
  Mail, 
  PencilLine, 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  Camera 
} from 'lucide-react';

const Input = forwardRef(({ icon: Icon, error, rightIcon, ...props }, ref) => (
  <div className="relative w-full flex flex-col">
    <div className="relative w-full">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent pointer-events-none z-10" />
      <input
        ref={ref}
        {...props}
        className={`w-full bg-background text-text rounded-lg border-2 
                 px-10 py-2 focus:outline-none transition-all duration-300
                 placeholder:text-primary/50 ${
                   error 
                     ? 'border-red-500 focus:border-red-600' 
                     : 'border-secondary/30 focus:border-accent'
                 } ${rightIcon ? 'pr-12' : ''}`}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
    {error && (
      <div className="min-h-[20px] mt-1">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )}
  </div>
));
const PasswordInput = forwardRef(({ error, value, onChange, onBlur, name, placeholder }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };

  const visibilityIcon = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="text-accent/70 hover:text-accent transition-colors"
    >
      {isPasswordVisible ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  );

  return (
    <Input
      ref={ref}
      icon={Lock}
      type={isPasswordVisible ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      error={error}
      rightIcon={visibilityIcon}
    />
  );
});

function Modal({ show, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
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

  const [touchedFields, setTouchedFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const bioRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  useEffect(() => {
    if (show) {
      fetchUserProfile();
    }
  }, [show]);
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/get-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setFormData(prevData => ({
        ...prevData,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        bio: data.user.bio,
      }));

      if (data.user.profileImage) {
        setImagePreview(`http://127.0.0.1:8000/storage/${data.user.profileImage}`);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to load user profile' }));
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      
      // Validate file size immediately
      if (file.size > 2 * 1024 * 1024) {
        setValidationErrors(prev => ({ ...prev, image: 'Image size must not exceed 2MB' }));
      } else {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error when user starts typing
      if (touchedFields[name]) {
        const errors = validateProfileForm({ ...formData, [name]: value });
        setValidationErrors(prev => ({ ...prev, [name]: errors[name] }));
      }
    }
  }, [formData, touchedFields]);

  const handleBlur = useCallback((fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const errors = validateProfileForm(formData);
    setValidationErrors(prev => ({ ...prev, [fieldName]: errors[fieldName] }));
  }, [formData]);



  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allFields);

    // Validate all fields
    const errors = validateProfileForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrors(prev => ({ ...prev, general: 'Please correct the errors before submitting' }));
      return;
    }

    setErrors({});
    setIsConfirming(true);
  }, [formData]);

  const handleConfirm = useCallback(async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });
    formDataToSend.append('confirmPassword', confirmPassword);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/update-profile', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 422) {
          // Handle validation errors
          setServerErrors(data.errors || {});
          setIsConfirming(false);
          return;
        }
        throw new Error(data.error || data.message || `Error: ${response.statusText}`);
      }

      setSuccessMessage('Profile updated successfully!');
      onSave(data.user);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message }));
      setIsConfirming(false);
    }
  }, [formData, confirmPassword, onSave, onClose]);

  if (!show) return null;
  
  

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-background p-6 rounded-2xl shadow-custom">
        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-2xl font-semibold text-center text-text">
            Edit Your Profile
          </h2>
          <button 
            onClick={onClose}
            className="absolute right-0 top-0 text-primary/70 hover:text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-accent/20 text-text rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-center">
            {errors.general}
          </div>
        )}

        {isConfirming ? (
          <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-6">
            <Input
              icon={Lock}
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your current password to confirm changes"
            />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="px-6 py-2 rounded-lg border-2 border-btnOutline text-primary
                         hover:bg-secondary/10 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-button
                         hover:bg-accent text-background transition-all duration-300"
              >
                Confirm Changes
              </button>
              
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary/30">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <User className="w-16 h-16 text-primary/50" />
                    </div>
                  )}
                  {validationErrors.image && (
                <p className="absolute -bottom-6 text-sm text-red-500">
                  {validationErrors.image}
                </p>
              )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-button rounded-full 
                                flex items-center justify-center cursor-pointer
                                hover:bg-accent transition-colors duration-300">
                  <Camera className="w-5 h-5 text-background" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                ref={firstNameRef}
                icon={User}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                placeholder="First Name"
                error={touchedFields.firstName ? validationErrors.firstName : ''}
              />
              <Input
  ref={lastNameRef}
  icon={User}
  type="text"
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
  onBlur={() => handleBlur('lastName')}
  placeholder="Last Name"
  error={touchedFields.lastName ? validationErrors.lastName : ''}
/>
            </div>

           <Input
              ref={emailRef}
              icon={Mail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="Email Address"
              error={touchedFields.email ? (validationErrors.email || serverErrors.email) : ''}
            />


            {/* Bio Field */}
            <div className="relative">
              <PencilLine className="absolute left-3 top-3 w-5 h-5 text-accent" />
              <textarea
                ref={bioRef}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                onBlur={() => handleBlur('bio')}
                placeholder="Tell us about yourself..."
                className={`w-full h-32 bg-background text-text rounded-lg border-2 
                         px-10 py-2 focus:outline-none transition-all duration-300 
                         placeholder:text-primary/50 resize-none ${
                           validationErrors.bio 
                             ? 'border-red-500 focus:border-red-600' 
                             : 'border-secondary/30 focus:border-accent'
                         }`}
              />
              {touchedFields.bio && validationErrors.bio && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.bio}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="relative">
              <PasswordInput
                ref={newPasswordRef}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('newPassword')}
                placeholder="New Password"
                error={touchedFields.newPassword ? validationErrors.newPassword : ''}
              />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/70 
                           hover:text-accent transition-colors"
                >
                  
                </button>
              </div>
              
              <PasswordInput
                ref={confirmNewPasswordRef}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmNewPassword')}
                placeholder="Confirm New Password"
                error={touchedFields.confirmNewPassword ? validationErrors.confirmNewPassword : ''}
              />
            </div>

            {errors.password && (
              <div className="text-red-400 text-sm mt-2">
                {errors.password}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg border-2 border-btnOutline text-primary
                         hover:bg-secondary/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-button
                         hover:bg-accent text-background transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Modal;