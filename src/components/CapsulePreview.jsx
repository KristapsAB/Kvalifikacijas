import React from 'react';
import { Calendar, Clock, Lock, Users, Globe, Camera } from 'lucide-react';

const CapsulePreview = ({ formData }) => {
  const getDesignStyles = (design) => {
    const styles = {
      default: {
        container: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300',
        header: 'text-amber-900 bg-amber-200/50',
        accent: 'text-amber-700',
        imageContainer: 'bg-amber-100 border-amber-200',
      },
      retro: {
        container: 'bg-[#f3e8d2] border-orange-300',
        header: 'text-orange-900 bg-orange-100/50',
        accent: 'text-orange-800',
        imageContainer: 'bg-orange-50 border-orange-200',
        filter: 'sepia',
      },
      futuristic: {
        container: 'bg-gradient-to-br from-cyan-900 to-blue-900 border-cyan-400',
        header: 'text-cyan-100 bg-cyan-800/50',
        accent: 'text-cyan-400',
        imageContainer: 'bg-cyan-800/30 border-cyan-500',
      },
      minimalist: {
        container: 'bg-white border-gray-200',
        header: 'text-gray-800 bg-gray-50',
        accent: 'text-gray-600',
        imageContainer: 'bg-gray-50 border-gray-100',
      },
      nature: {
        container: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300',
        header: 'text-green-900 bg-green-100/50',
        accent: 'text-green-700',
        imageContainer: 'bg-green-50 border-green-200',
      },
      celestial: {
        container: 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-400',
        header: 'text-purple-100 bg-purple-800/50',
        accent: 'text-purple-300',
        imageContainer: 'bg-purple-800/30 border-purple-500',
      },
      dreamy: {
        container: 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-300',
        header: 'text-pink-900 bg-pink-100/50',
        accent: 'text-pink-700',
        imageContainer: 'bg-pink-50 border-pink-200',
      },
      seasonal: {
        container: 'bg-gradient-to-br from-yellow-50 to-green-50 border-yellow-300',
        header: 'text-yellow-900 bg-yellow-100/50',
        accent: 'text-yellow-700',
        imageContainer: 'bg-yellow-50 border-yellow-200',
      }
    };
    return styles[design] || styles.default;
  };

  const styles = getDesignStyles(formData.design);
  const date = new Date(formData.time);

  const getPrivacyIcon = () => {
    switch (formData.privacy) {
      case 'private':
        return <Lock size={16} className={styles.accent} />;
      case 'friends':
        return <Users size={16} className={styles.accent} />;
      case 'public':
        return <Globe size={16} className={styles.accent} />;
      default:
        return <Lock size={16} className={styles.accent} />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className={`rounded-lg border-2 overflow-hidden shadow-lg ${styles.container}`}>
        {/* Header */}
        <div className={`p-4 ${styles.header}`}>
          <h2 className="text-xl font-bold mb-2">{formData.title || 'Untitled Capsule'}</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className={styles.accent} />
              <span>{date.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className={styles.accent} />
              <span>{date.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              {getPrivacyIcon()}
              <span className="capitalize">{formData.privacy}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Description */}
          {formData.description && (
            <div className="mb-4">
              <p className="text-sm whitespace-pre-wrap">{formData.description}</p>
            </div>
          )}

          {/* Images Preview */}
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              {formData.images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-video rounded-lg border ${styles.imageContainer} overflow-hidden group`}
                >
                  <img
                    src={URL.createObjectURL(image.file)}
                    alt={`Preview ${index + 1}`}
                    className={`w-full h-full object-cover ${styles.filter || ''}`}
                  />
                  {image.comment && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm p-2 text-center">{image.comment}</p>
                    </div>
                  )}
                </div>
              ))}
              {formData.images.length > 3 && (
                <div className={`flex items-center justify-center rounded-lg border ${styles.imageContainer} p-3`}>
                  <div className="flex items-center gap-2">
                    <Camera size={20} className={styles.accent} />
                    <span className={styles.accent}>+{formData.images.length - 3} more</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vision */}
          {formData.vision && (
            <div className={`rounded-lg p-4 mt-4 ${styles.imageContainer}`}>
              <h3 className={`font-semibold mb-2 ${styles.accent}`}>Vision</h3>
              <p className="text-sm whitespace-pre-wrap">{formData.vision}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapsulePreview;