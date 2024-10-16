import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Clock, UserPlus } from 'lucide-react';

const NotificationSidebar = ({ isOpen, onClose, onUpdateCount, fetchFriendRequestCount }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  const fetchFriendRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/friends/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch friend requests');

      const data = await response.json();
      setFriendRequests(data);
      onUpdateCount?.(data.length);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  }, [onUpdateCount]);

  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
    }
  }, [isOpen, fetchFriendRequests]);
  

  const handleFriendRequest = async (requestId, action) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
  
      const response = await fetch(`http://127.0.0.1:8000/api/friends/request/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) throw new Error(`Failed to ${action} friend request`);
  
      // Refresh both the friend requests and the count
      await fetchFriendRequests();
      await fetchFriendRequestCount();
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };
  
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };
  

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed top-0 right-0 h-full w-80 bg-background shadow-lg z-50 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-bold text-xl text-text">Friend Requests</h2>
          <button onClick={onClose} className="text-text hover:text-accent transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <UserPlus size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-text">{request.user.name} sent you a friend request</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleFriendRequest(request.id, 'accept')}
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleFriendRequest(request.id, 'decline')}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell size={48} />
              <p className="mt-4 text-lg font-medium">No new friend requests</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSidebar;