import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, Sparkles, Play, Pause, RefreshCw } from 'lucide-react';

const AnimatedCapsule = ({ capsuleData, onOpen }) => {
  const [stage, setStage] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [transition, setTransition] = useState('zoom');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer;
    if (isPlaying && showContent) {
      setProgress(0);
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setActiveIndex((prevIndex) => {
              const next = (prevIndex + 1) % (capsuleData?.images?.length || 1);
              setTransition(['zoom', 'pan', 'fade'][Math.floor(Math.random() * 3)]);
              return next;
            });
            return 0;
          }
          return prev + 2; 
        });
      }, 100);
    }
    return () => clearInterval(progressTimer);
  }, [isPlaying, activeIndex, showContent, capsuleData?.images?.length]);

  const particles = [...Array(40)].map((_, i) => ({
    color: [
      '#A7ACCD', // primary
      '#5E3762', // secondary
      '#B2779F', // accent
      '#FF95DD', // button
      '#E5E6F0', // text
      '#FFB6C1', // light pink
      '#9370DB', // medium purple
      '#FF69B4', // hot pink
    ][Math.floor(Math.random() * 8)],
    size: Math.random() * 8 + 4,
    spread: Math.random() * 360,
    distance: Math.random() * 200 + 100,
    delay: Math.random() * 0.5,
  }));

  const handleUnlock = () => {
    if (stage < 3) {
      setStage(prev => prev + 1);
      if (stage === 2) {
        setIsUnlocking(true);
        setTimeout(() => {
          setShowContent(true);
          if (onOpen) onOpen();
        }, 3000); // Increased duration for the explosion animation
      }
    }
  };

  const getImageAnimation = () => {
    switch (transition) {
      case 'zoom':
        return {
          initial: { scale: 1.2, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 2.5, ease: "easeOut" }
        };
      case 'pan':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 },
          transition: { duration: 2.5, ease: "easeOut" }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 2, ease: "easeOut" }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 2, ease: "easeOut" }
        };
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-gradient-to-b from-background to-secondary relative overflow-hidden">
      {!showContent ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Enhanced particle effect */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(45deg, ${[
                    '#A7ACCD',
                    '#5E3762',
                    '#B2779F',
                    '#FF95DD',
                  ][Math.floor(Math.random() * 4)]}aa, transparent)`,
                }}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  scale: 0.5,
                }}
                animate={{
                  y: [-30, 30],
                  x: [-20, 20],
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>

          {/* Explosion particles */}
          {isUnlocking && (
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(particle.spread * Math.PI / 180) * particle.distance,
                    y: Math.sin(particle.spread * Math.PI / 180) * particle.distance,
                    scale: [0, 3, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Main capsule container */}
          <motion.div
            className="relative"
            animate={isUnlocking ? {
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.2, 0.8, 1.4, 0],
              filter: ["brightness(1)", "brightness(2)", "brightness(3)", "brightness(4)"],
            } : {
              rotate: 0,
              scale: 1,
            }}
            transition={isUnlocking ? {
              duration: 2,
              times: [0, 0.2, 0.4, 0.6, 1],
              ease: "easeInOut",
            } : {
              duration: 0.3,
            }}
          >
            {/* Progress indicator */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < stage ? 'bg-button' : 'bg-primary/30'
                    }`}
                    animate={{
                      scale: i === stage - 1 ? [1, 1.2, 1] : 1,
                      boxShadow: i < stage ? [
                        "0 0 0 0 rgba(255, 149, 221, 0)",
                        "0 0 20px 10px rgba(255, 149, 221, 0.5)",
                        "0 0 0 0 rgba(255, 149, 221, 0)"
                      ] : "none"
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>

            {/* Capsule body */}
            <motion.div
              className="w-64 h-96 rounded-3xl relative cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${isUnlocking ? '#FF95DD' : '#5E3762'}, ${isUnlocking ? '#B2779F' : '#A7ACCD'})`,
              }}
              whileHover={{ scale: 1.02 }}
              onClick={handleUnlock}
            >
              {/* Glowing effects */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: isUnlocking
                    ? [
                        'radial-gradient(circle at center, transparent 0%, transparent 100%)',
                        'radial-gradient(circle at center, rgba(255,149,221,0.5) 0%, transparent 70%)',
                        'radial-gradient(circle at center, transparent 0%, transparent 100%)',
                      ]
                    : 'none',
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Capsule details */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                <motion.div
                  animate={isUnlocking ? {
                    scale: [1, 2, 0],
                    rotate: [0, 180, 360],
                    opacity: [1, 0.8, 0],
                  } : {
                    scale: 1,
                    rotate: 0,
                    opacity: 1,
                  }}
                  transition={{ duration: 1.5 }}
                >
                  {stage < 3 ? (
                    <Lock className="w-12 h-12 text-text" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-button" />
                  )}
                </motion.div>
                <motion.div
                  className="text-text font-bold text-lg text-center"
                  animate={isUnlocking ? {
                    opacity: [1, 0],
                    y: [0, -20],
                  } : {}}
                  transition={{ duration: 1 }}
                >
                  {stage < 3 ? "Click to Unlock" : "Opening..."}
                </motion.div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-1 rounded"
                style={{ background: isUnlocking ? '#FF95DD' : '#A7ACCD' }}
                animate={isUnlocking ? {
                  scaleX: [1, 1.5, 0],
                  opacity: [1, 0.8, 0],
                } : {}}
                transition={{ duration: 1.5 }}
              />
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-1 rounded"
                style={{ background: isUnlocking ? '#FF95DD' : '#A7ACCD' }}
                animate={isUnlocking ? {
                  scaleX: [1, 1.5, 0],
                  opacity: [1, 0.8, 0],
                } : {}}
                transition={{ duration: 1.5 }}
              />
              
              <Clock className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-6 h-6 text-text" />
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* Memory Player */}
          <div className="absolute inset-0 bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="relative w-full h-full"
                {...getImageAnimation()}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                <img
                  src={capsuleData?.images[activeIndex]?.src || "/api/placeholder/800/600"}
                  alt={capsuleData?.images[activeIndex]?.caption}
                  className="w-full h-full object-cover"
                />
                
                {/* Caption */}
                <motion.div
                  className="absolute bottom-20 left-0 right-0 p-8 text-center"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <h2 className="text-white text-3xl font-bold mb-2">
                    {capsuleData?.images[activeIndex]?.caption}
                  </h2>
                  <p className="text-white/80 text-lg">
                    {capsuleData?.images[activeIndex]?.date}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicators */}
            <div className="absolute top-6 left-4 right-4 flex gap-2 z-10">
              {capsuleData?.images?.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setActiveIndex(index);
                    setProgress(0);
                  }}
                >
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{
                      width: index === activeIndex ? `${progress}%` : index < activeIndex ? "100%" : "0%"
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
              <motion.button
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </motion.button>
              <motion.button
                className="p-3 rounded-full bg-white/10 hover:bg/20 backdrop-blur-sm transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveIndex((prev) => (prev + 1) % (capsuleData?.images?.length || 1));
                  setProgress(0);
                }}
              >
                <RefreshCw className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedCapsule;