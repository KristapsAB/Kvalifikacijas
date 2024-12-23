import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Clock, UserPlus, Timer, MessageSquare } from 'lucide-react';
import CapsuleAcceptModal from './CapsuleAcceptModal';

const NotificationSidebar = ({ isOpen, onClose, onUpdateCount, fetchFriendRequestCount, onOpenAcceptModal }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [sharedCapsules, setSharedCapsules] = useState([]);
  const [activeTab, setActiveTab] = useState('friends');
  const [error, setError] = useState(null);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

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

  const fetchSharedCapsules = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.warn('No access token found');
        setError('Authentication required');
        return;
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/capsules/shared', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSharedCapsules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message);
      setSharedCapsules([]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
      fetchSharedCapsules();
    }
  }, [isOpen, fetchFriendRequests, fetchSharedCapsules]);

  const handleAcceptCapsule = (share) => {
    setSelectedCapsule({
      id: share.id,
      share_id: share.share_id,
      title: share.title,
      description: share.description,
      vision: share.vision
    });
    setIsAcceptModalOpen(true);
  };

  const handleAcceptComplete = async () => {
    setIsAcceptModalOpen(false);
    setSelectedCapsule(null);
    await fetchSharedCapsules();
  };

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
  
      await fetchFriendRequests();
      await fetchFriendRequestCount();
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };

  const handleShareResponse = async (shareId, status) => {
    try {
      if (status === 'accepted') {
        const share = sharedCapsules.find(s => s.share_id === shareId);
        handleAcceptCapsule(share);
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) return;

      if (status === 'declined') {
        setSharedCapsules(prev => prev.filter(s => s.share_id !== shareId));
      }

      const response = await fetch(`http://127.0.0.1:8000/api/capsules/share/${shareId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${status} capsule share`);
      }

      await fetchSharedCapsules();
    } catch (error) {
      console.error(`Error ${status}ing capsule share:`, error);
      setError(`Failed to ${status} capsule share: ${error.message}`);
    }
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 right-0 h-full w-80 bg-background shadow-lg z-40 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="font-bold text-xl text-text">Notifications</h2>
            <button onClick={onClose} className="text-text hover:text-accent transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex border-b border-gray-200 text-accent">
            <button
              className={`flex-1 py-2 px-4 ${activeTab === 'friends' ? 'border-b-2 border-blue-500 text-text' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friend Requests
            </button>
            <button
              className={`flex-1 py-2 px-4 ${activeTab === 'capsules' ? 'border-b-2 border-blue-500 text-text' : ''}`}
              onClick={() => setActiveTab('capsules')}
            >
              Shared Capsules
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {activeTab === 'friends' ? (
              friendRequests.length > 0 ? (
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
                  <UserPlus size={48} />
                  <p className="mt-4 text-lg font-medium">No friend requests</p>
                </div>
              )
            ) : (
              <>
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {sharedCapsules.length > 0 ? (
                  sharedCapsules.map((share) => (
                    <motion.div
                      key={share.share_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <Timer size={18} className="text-purple-500" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-text">
                            {share.shared_by} shared a capsule with you
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {share.title}
                          </p>
                          {share.vision && (
                            <p className="text-xs text-gray-600 mt-1">
                              Vision: {share.vision}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(share.created_at).toLocaleString()}
                          </p>

                          {share.status === 'pending' ? (
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => handleShareResponse(share.share_id, 'accepted')}
                                className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleShareResponse(share.share_id, 'declined')}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs mt-2 capitalize text-gray-500">
                              Status: {share.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : !error && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare size={48} />
                    <p className="mt-4 text-lg font-medium">No shared capsules</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
      <CapsuleAcceptModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        capsule={selectedCapsule}
        onAcceptComplete={handleAcceptComplete}
      />
    </>
  );
};

export default NotificationSidebar;