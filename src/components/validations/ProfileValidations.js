export const validateProfileForm = (formData) => {
  const errors = {};
  
  const safeTrim = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  const firstName = safeTrim(formData.firstName);
  if (!firstName) {
    errors.firstName = 'First name is required';
  } else if (firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  } else if (firstName.length > 50) {
    errors.firstName = 'First name must not exceed 50 characters';
  }

  const lastName = safeTrim(formData.lastName);
  if (!lastName) {
    errors.lastName = 'Last name is required';
  } else if (lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  } else if (lastName.length > 50) {
    errors.lastName = 'Last name must not exceed 50 characters';
  }

  const email = safeTrim(formData.email);
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }

  const bio = safeTrim(formData.bio);
  if (bio && bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
  }

  const newPassword = safeTrim(formData.newPassword);
  const confirmNewPassword = safeTrim(formData.confirmNewPassword);

  if (newPassword) {
    if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }
  } else if (confirmNewPassword) {
    errors.newPassword = 'Please enter a new password';
  }

  if (formData.image && formData.image.size > 2 * 1024 * 1024) { // 2MB
    errors.image = 'Image size must not exceed 2MB';
  }

  return errors;
};