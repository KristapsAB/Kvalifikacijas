import React, { useEffect, useRef, useState } from 'react';

const AnimatedCapsule = ({ images }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const angleRef = useRef(0);
  const [clickCount, setClickCount] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);

  useEffect(() => {
    const rotateCarousel = () => {
      if (showCarousel) {
        const rotationSpeed = hoveredImageIndex !== null ? 0.2 : 0.5;
        angleRef.current += rotationSpeed;
        if (containerRef.current) {
          containerRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
        }
      }
      animationRef.current = requestAnimationFrame(rotateCarousel);
    };

    if (showCarousel) {
      animationRef.current = requestAnimationFrame(rotateCarousel);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredImageIndex, showCarousel]);

  const handleCapsuleClick = () => {
    if (clickCount < 3) {
      setClickCount(prev => prev + 1);
    }
    if (clickCount === 2) {
      setIsExploded(true);
      setTimeout(() => {
        setShowCarousel(true);
      }, 1500); // Increased delay for explosion effect
    }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {!isExploded ? (
        <div 
          className="cursor-pointer"
          onClick={handleCapsuleClick}
        >
          <div className="relative">
            <div 
              className="w-40 h-64 bg-pink-500 rounded-3xl border-4 border-pink-300 shadow-lg"
              style={{
                animation: clickCount === 2 ? 'shake 0.5s ease-in-out' : 'pulse 2s infinite',
                transform: `rotate(${clickCount * 5}deg) scale(${1 + clickCount * 0.05})`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <div className="absolute top-1/2 left-0 w-full h-1 bg-pink-300" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg font-bold text-pink-500">
                {clickCount}/3 clicks
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {!showCarousel && (
            <div className="absolute  flex items-center w-full h-full justify-center">
              {/* Central explosion flash */}
              <div 
                className="absolute w-full h-screen bg-white rounded-full"
                style={{
                  animation: 'flash 0.5s forwards',
                }}
              />
              
              {Array.from({ length: 3 }).map((_, ringIndex) => (
                <div
                  key={`ring-${ringIndex}`}
                  className="absolute w-full h-full"
                  style={{
                    animation: `expand-ring ${0.8 + ringIndex * 0.2}s forwards`,
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={`particle-${ringIndex}-${i}`}
                      className="absolute left-1/2 top-1/2 w-6 h-6"
                      style={{
                        transform: `rotate(${i * 30}deg)`,
                      }}
                    >
                      <div 
                        className="w-full h-full bg-pink-500 rounded-full"
                        style={{
                          animation: `particle-fade ${1 + ringIndex * 0.2}s forwards`,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}

              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`shockwave-${i}`}
                  className="absolute w-40 h-40 border-4 border-pink-400 rounded-full"
                  style={{
                    animation: `shockwave ${0.8 + i * 0.2}s forwards ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div
            ref={containerRef}
            className="relative w-full h-full"
            style={{ 
              transformStyle: 'preserve-3d',
              opacity: showCarousel ? 1 : 0,
              transform: `scale(${showCarousel ? 1 : 0.5}) translateZ(${showCarousel ? 0 : -1000}px)`,
              transition: 'opacity 1s ease-out, transform 1s ease-out',
            }}
          >
            {images.map((image, index) => {
              const angle = (index * (360 / images.length));
              const angleInRadians = angle * (Math.PI / 180);
              const radius = 400;
              
              const x = Math.sin(angleInRadians) * radius;
              const z = Math.cos(angleInRadians) * radius;
              
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 w-64 h-96"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div 
                    className="relative w-full h-full group"
                    style={{
                      transform: 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                    }}
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <img
                      src={image.src}
                      alt={image.caption}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm text-white rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <h3 className="font-bold text-lg mb-1">{image.caption}</h3>
                      <p className="text-sm text-gray-200">{image.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes flash {
            0% { 
              transform: scale(0);
              opacity: 1;
            }
            100% { 
              transform: scale(4);
              opacity: 0;
            }
          }
          @keyframes expand-ring {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: scale(3) rotate(45deg);
              opacity: 0;
            }
          }
          @keyframes particle-fade {
            0% {
              transform: scale(1) translateX(0);
              opacity: 1;
            }
            100% {
              transform: scale(0) translateX(100px);
              opacity: 0;
            }
          }
          @keyframes shockwave {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(8);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedCapsule;