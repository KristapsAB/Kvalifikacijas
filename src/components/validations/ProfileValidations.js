// validation.js
export const validateProfileForm = (formData) => {
    const errors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length > 255) {
      errors.firstName = 'First name must not exceed 255 characters';
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.firstName)) {
      errors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }
  
    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 255) {
      errors.lastName = 'Last name must not exceed 255 characters';
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.lastName)) {
      errors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }
  
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (formData.email.length > 255) {
      errors.email = 'Email must not exceed 255 characters';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    // Bio validation
    if (formData.bio && formData.bio.length > 1000) {
      errors.bio = 'Bio must not exceed 1000 characters';
    }
  
    // Image validation
    if (formData.image && formData.image.size > 2 * 1024 * 1024) {
      errors.image = 'Image size must not exceed 2MB';
    }
  
    // Password validations
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
        errors.newPassword = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
        errors.newPassword = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.newPassword)) {
        errors.newPassword = 'Password must contain at least one number';
      } else if (!/(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
        errors.newPassword = 'Password must contain at least one special character (!@#$%^&*)';
      }
  
      if (formData.newPassword !== formData.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }
    }
  
    return errors;
  };