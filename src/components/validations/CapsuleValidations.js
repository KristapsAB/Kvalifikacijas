import { useState } from 'react';

const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'video/mp4': ['.mp4']
};

const MAX_FILE_SIZE = 65536 * 1024; 

const validateCapsuleForm = (formData) => {
  const errors = {};

  if (!formData.title) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (!formData.description) {
    errors.description = 'Description is required';
  }

  if (!formData.images || formData.images.length === 0) {
    errors.images = 'At least one image is required';
  }

  if (!formData.time) {
    errors.time = 'Opening time is required';
  } else {
    const selectedTime = new Date(formData.time);
    const currentTime = new Date();
    if (selectedTime <= currentTime) {
      errors.time = 'Opening time must be in the future';
    }
  }

  if (!formData.vision) {
    errors.vision = 'Vision is required';
  }

  if (!formData.privacy || !['private', 'friends', 'public'].includes(formData.privacy)) {
    errors.privacy = 'Invalid privacy setting';
  }

  if (!formData.design) {
    errors.design = 'Capsule design is required';
  }

  return errors;
};

// Custom hook for capsule form validation
export const useCapsuleValidation = (initialState) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialState);

  const validateFile = (file) => {
    const fileError = {};

    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      fileError.type = `File type not supported. Allowed types: ${Object.values(ALLOWED_FILE_TYPES).flat().join(', ')}`;
      return fileError;
    }

    if (file.size > MAX_FILE_SIZE) {
      fileError.size = `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`;
      return fileError;
    }

    return null;
  };

  const handleFileSelection = (files) => {
    const fileErrors = [];
    const validFiles = [];

    Array.from(files).forEach((file, index) => {
      const fileError = validateFile(file);
      if (fileError) {
        fileErrors.push({ file: file.name, errors: fileError });
      } else {
        validFiles.push({ file, comment: '' });
      }
    });

    if (fileErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        files: fileErrors
      }));
      return false;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    return true;
  };

  const validateForm = () => {
    const newErrors = validateCapsuleForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleFileSelection,
    validateForm,
    setFormData
  };
};

// Error message component for displaying validation errors
export const ValidationError = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="text-red-500 text-sm mt-1 font-lexend">
      {error}
    </div>
  );
};