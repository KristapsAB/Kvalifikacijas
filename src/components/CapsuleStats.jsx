import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const CapsuleStatsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMetric, setDisplayMetric] = useState('created'); // 'created', 'privacy'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/capsules/monthly-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const statsData = await response.json();
        setData(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = {
    created: 'Created Capsules',
    privacy: 'Privacy Distribution'
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-[#1E1E1E] rounded-2xl p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-[#1E1E1E] rounded-2xl p-6 flex items-center justify-center">
        <div className="text-red-500 text-lg">Error loading statistics</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#1E1E1E] rounded-2xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-3xl font-bold italic">Capsule Stats</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setDisplayMetric(displayMetric === 'created' ? 'privacy' : 'created')}
            className="bg-[#5E3762] text-white px-4 py-2 rounded-full flex items-center"
          >
            {metrics[displayMetric]}
            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        {displayMetric === 'created' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#B2779F' }} 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#B2779F' }} 
              axisLine={false} 
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2E2E2E',
                border: 'none',
                borderRadius: '8px',
                color: '#B2779F'
              }}
            />
            <Bar 
              dataKey="created" 
              fill="#A7ACCD" 
              radius={[10, 10, 0, 0]} 
              barSize={30}
              name="Created Capsules"
            />
          </BarChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#B2779F' }} 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#B2779F' }} 
              axisLine={false} 
              tickLine={false}
              stacked
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2E2E2E',
                border: 'none',
                borderRadius: '8px',
                color: '#B2779F'
              }}
            />
            <Legend />
            <Bar 
              dataKey="private" 
              fill="#A7ACCD" 
              radius={[10, 10, 0, 0]} 
              barSize={30}
              stackId="a"
              name="Private"
            />
            <Bar 
              dataKey="public" 
              fill="#5E3762" 
              radius={[10, 10, 0, 0]} 
              barSize={30}
              stackId="a"
              name="Public"
            />
            <Bar 
              dataKey="friends" 
              fill="#8B5E88" 
              radius={[10, 10, 0, 0]} 
              barSize={30}
              stackId="a"
              name="Friends"
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default CapsuleStatsChart;