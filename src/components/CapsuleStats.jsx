import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const CapsuleStatsChart = () => {
  const data = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 30 },
    { month: 'May', value: 90 },
    { month: 'Jun', value: 50 },
    { month: 'Jul', value: 70 },
    { month: 'Aug', value: 40 },
    { month: 'Sep', value: 60 },
    { month: 'Oct', value: 100 },
    { month: 'Nov', value: 50 },
    { month: 'Dec', value: 70 },
  ];

  return (
    <div className="w-full h-full bg-[#1E1E1E] rounded-2xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-3xl font-bold italic">Capsule Stats</h2>
        <button className="bg-[#5E3762] text-white px-4 py-2 rounded-full flex items-center">
          Opened
          <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#B2779F' }} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis hide={true} />
          <Bar 
            dataKey="value" 
            fill="#A7ACCD" 
            radius={[10, 10, 0, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapsuleStatsChart;