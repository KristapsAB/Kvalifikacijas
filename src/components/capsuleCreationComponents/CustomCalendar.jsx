import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';


const CustomCalendar = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [showClock, setShowClock] = useState(false);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1));

  const handleDateSelect = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    newDate.setHours(selectedDate.getHours());
    newDate.setMinutes(selectedDate.getMinutes());
    onDateChange(newDate);
    setShowClock(true); // Show clock immediately after date selection
  };

  const handleTimeChange = (newDate) => {
    onDateChange(newDate);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-background text-text font-lexend">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:text-[#A3688F]">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">
          {months[currentMonth]} {currentYear}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:text-[#A3688F]">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-bold py-2">
            {day}
          </div>
        ))}
        
        {[...emptyDays, ...days].map((day, index) => (
          <button
            key={index}
            onClick={() => day && handleDateSelect(day)}
            disabled={!day}
            className={`
              p-2 text-center rounded-lg transition-colors
              ${!day ? 'bg-transparent' : 'hover:bg-[#A3688F] hover:text-white'}
              ${selectedDate && day === selectedDate.getDate() && 
                currentMonth === selectedDate.getMonth() && 
                currentYear === selectedDate.getFullYear()
                ? 'bg-[#A3688F] text-white'
                : 'bg-background'}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 p-2 text-[#A3688F]">
          <Clock size={20} />
          <span className="font-bold">{formatTime(selectedDate)}</span>
        </div>
      </div> */}
    </div>
  );
};

export default CustomCalendar;