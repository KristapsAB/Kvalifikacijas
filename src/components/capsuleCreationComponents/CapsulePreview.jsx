import React from 'react';
import { Clock } from 'lucide-react';

const CapsulePreview = ({ formData }) => {
  const getDesignStyles = (design) => {
    const styles = {
      heritage: {
        container: 'bg-gradient-to-br from-amber-900 via-brown-800 to-amber-900 border-amber-400 text-white',
        header: 'text-amber-100 bg-black/30',
        accent: 'text-amber-400',
        imageContainer: 'bg-black/20 border-amber-400/30',
        filter: 'sepia brightness-90',
      },
      chronicle: {
        container: 'bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-400 text-white',
        header: 'text-emerald-100 bg-black/30',
        accent: 'text-emerald-400',
        imageContainer: 'bg-black/20 border-emerald-400/30',
        filter: 'brightness-90',
      },
      legacy: {
        container: 'bg-gradient-to-br from-red-900 via-rose-900 to-red-900 border-red-400 text-white',
        header: 'text-red-100 bg-black/30',
        accent: 'text-red-300',
        imageContainer: 'bg-black/20 border-red-400/30',
        filter: 'contrast-110 brightness-85',
      },
      vault: {
        container: 'bg-gradient-to-br from-violet-900 via-indigo-900 to-violet-900 border-violet-400 text-white',
        header: 'text-violet-100 bg-black/30',
        accent: 'text-violet-400',
        imageContainer: 'bg-black/20 border-violet-400/30',
        filter: 'brightness-90 contrast-105',
      }
    };
    return styles[design] || styles.heritage;
  };

  const styles = getDesignStyles(formData.design);
  const openDate = new Date(formData.time);
  const today = new Date();
  const daysUntilOpen = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));

  // Enhanced stacking effect with theme-specific adjustments
  const getStackStyles = (index, total) => {
    if (total <= 1) return {};
    
    const maxRotation = formData.design === 'chronicle' ? 0 : 6; // Straight stack for chronicle theme
    const rotation = index === 0 ? 0 : maxRotation * (index % 2 === 0 ? 1 : -1);
    const offsetX = formData.design === 'chronicle' ? index * 2 : index * 4;
    const offsetY = index * 4;
    const scale = 1 - (index * 0.015);
    const shadowIntensity = Math.max(1, 3 - index);
    
    return {
      transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
      zIndex: total - index,
      boxShadow: `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0,0,0,0.2)`
    };
  };

  // Theme-specific decorative elements
  const ThemeDecoration = () => {
    switch (formData.design) {
      case 'heritage':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYxIi8+PC9zdmc+')] opacity-10" />
          </div>
        );
      case 'chronicle':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10" />
          </div>
        );
      case 'legacy':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYxIi8+PC9zdmc+')] opacity-5" />
          </div>
        );
      case 'vault':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 font-lexend">
      <div className={`relative rounded-lg border-2 overflow-hidden shadow-lg backdrop-blur-sm ${styles.container}`}>
        <ThemeDecoration />
        
        {/* Header */}
        <div className={`p-4 backdrop-blur-md ${styles.header}`}>
          <h2 className="text-3xl font-bold mb-2">{formData.title || 'Untitled Capsule'}</h2>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Stacked Images with Theme-Specific Effects */}
          {formData.images && formData.images.length > 0 && (
            <div className="relative h-72 mb-4">
              <div className="absolute inset-x-0 top-0 flex justify-center items-start perspective-1000">
                {formData.images.slice(0, 5).map((image, index) => (
                  <div
                    key={index}
                    className="absolute w-full max-w-sm aspect-video rounded-lg border overflow-hidden 
                      transition-all duration-300 ease-in-out cursor-pointer
                      hover:rotate-0 hover:translate-x-0 hover:translate-y-0 hover:scale-105 hover:z-50
                      group"
                    style={getStackStyles(index, Math.min(formData.images.length, 5))}
                  >
                    <div className={`w-full h-full ${styles.imageContainer}`}>
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt={`Preview ${index + 1}`}
                          className={`w-full h-full object-cover blur-sm ${styles.filter}`}
                        />
                        <div className="absolute inset-0 bg-black/30" />
                      </div>
                      {image.comment && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 flex items-center justify-center">
                          <p className="text-white text-sm p-2 text-center">{image.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xl font-lexend text-center justify-center">
            <Clock size={16} className={styles.accent} />
            <span>Opens in {daysUntilOpen} days</span>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default CapsulePreview;