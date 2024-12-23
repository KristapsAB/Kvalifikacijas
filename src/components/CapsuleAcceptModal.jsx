import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CapsuleAcceptModal = ({ isOpen, onClose, capsule, onAcceptComplete }) => {
  const [images, setImages] = useState([]);
  const [imageComments, setImageComments] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    console.log('Modal state changed:', { isOpen, capsule });
  }, [isOpen, capsule]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Some files were skipped. Only images are allowed.');
    }

    setImages(prevImages => {
      const newImages = [...prevImages, ...validFiles];
      const newComments = {};
      validFiles.forEach((_, index) => {
        newComments[prevImages.length + index] = '';
      });
      
      setImageComments(prevComments => ({
        ...prevComments,
        ...newComments
      }));
      
      return newImages;
    });
  };

  const handleCommentChange = (index, comment) => {
    setImageComments(prev => ({
      ...prev,
      [index]: comment
    }));
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });

    setImageComments(prev => {
      const newComments = { ...prev };
      delete newComments[index];
      const reindexedComments = {};
      Object.keys(newComments)
        .filter(key => parseInt(key) > index)
        .forEach(key => {
          reindexedComments[parseInt(key) - 1] = newComments[key];
          delete newComments[key];
        });
      return { ...newComments, ...reindexedComments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('access_token');
      const statusResponse = await fetch(`${API_BASE_URL}/api/capsules/share/${capsule.share_id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' })
      });
  
      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.message || 'Failed to update capsule status');
      }

      const statusData = await statusResponse.json();
      const capsuleId = statusData.capsule_id;
  
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
        formData.append(`image_comments[${index}]`, imageComments[index] || '');
      });

      const response = await fetch(`${API_BASE_URL}/api/capsules/${capsuleId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept capsule');
      }
  
      onAcceptComplete?.();
      onClose();
    } catch (err) {
      setError(err.message);
      try {
        const token = localStorage.getItem('access_token');
        await fetch(`${API_BASE_URL}/api/capsules/share/${capsule.share_id}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'pending' })
        });
      } catch (resetErr) {
        console.error('Failed to reset status:', resetErr);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && capsule && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-lg z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-background w-full h-full md:h-[90vh] md:w-[90vw] md:max-w-7xl md:m-auto md:rounded-xl shadow-secondary flex flex-col overflow-hidden border border-primary/20"
          >
            <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-2xl font-lexend text-text">Accept Time Capsule</h2>
              <button 
                onClick={onClose}
                className="text-primary hover:text-text transition-colors p-2 hover:bg-secondary/20 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text">Capsule Details</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary">Title</label>
                        <p className="mt-1 text-lg text-text bg-secondary/10 p-3 rounded-md border border-accent/20">{capsule?.title}</p>
                      </div>
                      {capsule?.vision && (
                        <div>
                          <label className="block text-sm font-medium text-primary">Vision</label>
                          <p className="mt-1 text-text bg-secondary/10 p-3 rounded-md whitespace-pre-wrap border border-accent/20">{capsule.vision}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text">Add Your Images</h3>
                    <p className="text-sm text-primary mt-1">Upload images and add descriptions to contribute to this time capsule</p>

                    <label className="mt-4 flex justify-center items-center p-6 border-2 border-dashed border-accent/30 rounded-lg hover:border-accent transition-colors cursor-pointer bg-secondary/10">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto text-primary" size={24} />
                        <div className="flex text-sm text-primary">
                          <p className="pl-1">Click to upload or drag and drop images</p>
                        </div>
                        <p className="text-xs text-primary/70">PNG, JPG, GIF up to 2MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 mt-4 text-red-400 bg-red-900/20 p-3 rounded-md border border-red-500/20"
                      >
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                      </motion.div>
                    )}

                    <div className="mt-6 space-y-4">
                      <AnimatePresence>
                        {images.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex space-x-4 items-start p-4 bg-secondary/10 rounded-lg border border-accent/20"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-lg bg-background/50 flex items-center justify-center overflow-hidden">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-text font-medium">{image.name}</p>
                                  <p className="text-xs text-primary">
                                    {(image.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeImage(index)}
                                  className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded-full"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                              <textarea
                                placeholder="Add a description for this image..."
                                value={imageComments[index] || ''}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                className="mt-2 w-full px-3 py-2 bg-background border border-accent/20 rounded-md text-sm text-text placeholder-primary/50 focus:ring-2 focus:ring-button/30 focus:border-button min-h-[60px] resize-y"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3 bg-background">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary bg-transparent border border-btnOutline rounded-md hover:bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-button/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || images.length === 0}
                className="px-4 py-2 text-sm font-medium text-background bg-button rounded-md hover:bg-button/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save and Accept'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CapsuleAcceptModal;