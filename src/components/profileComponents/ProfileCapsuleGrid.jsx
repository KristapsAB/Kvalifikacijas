import React from 'react';
import { Clock, Lock, Unlock } from 'lucide-react';

const ProfileCapsulesGrid = ({ capsules, onCapsuleClick }) => {
  const getDesignStyles = (design) => {
    const styles = {
      retro: {
        container: 'bg-gradient-to-br from-rose-700 via-orange-800 to-rose-700 border-orange-400 text-white',
        header: 'text-orange-100 bg-black/30',
        accent: 'text-orange-400',
        imageContainer: 'bg-black/20 border-orange-400/30',
        filter: 'sepia brightness-75',
      },
      futuristic: {
        container: 'bg-gradient-to-br from-blue-900 to-blue-800 border-cyan-400 text-white',
        header: 'text-cyan-100 bg-black/30',
        accent: 'text-cyan-400',
        imageContainer: 'bg-black/20 border-cyan-400/30',
      },
      celestial: {
        container: 'bg-gradient-to-br from-purple-900 to-black border-purple-400 text-white',
        header: 'text-purple-100 bg-black/30',
        accent: 'text-purple-300',
        imageContainer: 'bg-black/20 border-purple-400/30',
      },
      dreamy: {
        container: 'bg-gradient-to-br from-pink-300/20 to-purple-300/20 backdrop-blur-sm border-pink-300 text-white',
        header: 'text-pink-100 bg-black/30',
        accent: 'text-pink-400',
        imageContainer: 'bg-black/20 border-pink-300/30',
      }
    };
    return styles[design] || styles.retro;
  };

  const getStackStyles = (index, total) => {
    if (total <= 1) return {};
    
    const maxRotation = 6;
    const rotation = index === 0 ? 0 : maxRotation * (index % 2 === 0 ? 1 : -1);
    const offsetX = index * 4;
    const offsetY = index * 4;
    const scale = 1 - (index * 0.015);
    const shadowIntensity = Math.max(1, 3 - index);
    
    return {
      transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
      zIndex: total - index,
      boxShadow: `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0,0,0,0.2)`
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {capsules.map((capsule) => {
        const styles = getDesignStyles(capsule.design);
        const isReady = capsule.daysLeft <= 0;
        
        return (
          <div
            key={capsule.id}
            className="group cursor-pointer"
            onClick={() => onCapsuleClick(capsule)}
          >
            <div className={`rounded-lg border-2 overflow-hidden shadow-lg backdrop-blur-sm h-full ${styles.container}`}>
              {/* Header */}
              <div className={`p-4 backdrop-blur-md ${styles.header}`}>
                <h3 className="text-xl font-bold">{capsule.title}</h3>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Stacked Images */}
                {capsule.images && capsule.images.length > 0 && (
                  <div className="relative h-48 mb-4">
                    <div className="absolute inset-x-0 top-0 flex justify-center items-start perspective-1000">
                      {capsule.images.slice(0, 3).map((image, index) => {
                        const stackStyles = getStackStyles(index, Math.min(capsule.images.length, 3));
                        
                        return (
                          <div
                            key={index}
                            className="absolute w-full aspect-video rounded-lg border overflow-hidden 
                              transition-all duration-300 ease-in-out
                              group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 
                              group-hover:scale-105"
                            style={stackStyles}
                          >
                            <div className={`w-full h-full ${styles.imageContainer}`}>
                              <div className="relative w-full h-full">
                                <img
                                  src={image.src || URL.createObjectURL(image.file)}
                                  alt={`Preview ${index + 1}`}
                                  className={`w-full h-full object-cover blur-sm ${styles.filter || ''}`}
                                />
                                <div className="absolute inset-0 bg-black/30" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2 text-lg font-lexend text-center justify-center">
                  {isReady ? (
                    <>
                      <Unlock size={16} className="text-green-400" />
                      <span className="text-green-400">Ready to open!</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} className={styles.accent} />
                      <span>Not ready to open</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileCapsulesGrid;