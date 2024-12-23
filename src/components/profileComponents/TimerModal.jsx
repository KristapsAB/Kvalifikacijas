import React, { useState, useEffect } from 'react';
import { Lock, Calendar, X } from 'lucide-react';

const TimerModal = ({ daysLeft: initialDaysLeft, onClose, openingDate, title }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const opening = new Date(openingDate).getTime();
      const now = new Date().getTime();
      const total = opening - now;
      
      if (total <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((total % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (Object.values(newTimeLeft).every(value => value === 0)) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [openingDate]);

  const formattedDate = new Date(openingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center font-lexend">
      <div className="relative w-20 h-24 bg-pink-500/10 rounded-xl flex items-center justify-center mb-2 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
        <span className="text-4xl font-bold bg-gradient-to-b from-pink-400 to-pink-600 bg-clip-text text-transparent">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md font-lexend">
      <div className="relative bg-background/95 rounded-3xl shadow-custom p-8 max-w-lg w-full mx-4 ">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-45">
          <Lock className="w-10 h-10 text-white -rotate-45" />
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-500/20 transition-all"
        >
          <X size={24} className="text-text" />
        </button>

        <div className="mt-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">{title || 'Time Capsule'}</h2>
          <p className="text-gray-400">
            This memory will unlock on:
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="font-semibold text-pink-500">{formattedDate}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <TimeBox value={timeLeft.days} label="DAYS" />
          <TimeBox value={timeLeft.hours} label="HOURS" />
          <TimeBox value={timeLeft.minutes} label="MINUTES" />
          <TimeBox value={timeLeft.seconds} label="SECONDS" />
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all rounded-xl font-semibold text-white shadow-lg"
        >
          Return to Profile
        </button>
      </div>
    </div>
  );
};

export default TimerModal;