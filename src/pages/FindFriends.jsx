import React, { useState, useEffect, useCallback, useMemo, memo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faTimes, faCheck, faUserFriends } from '@fortawesome/free-solid-svg-icons';

// Optimized image loading component
const ImageWithFallback = memo(({ src, alt, onLoad, onError, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc('/images/DefaultAvatar.jpg');
    onError?.();
  };

  return (
    <img 
      src={imgSrc}
      alt={alt} 
      className={className}
      onError={handleError}
      onLoad={onLoad}
      loading="lazy"
      decoding="async"
      width="128"
      height="128"
    />
  );
});

const UserModal = memo(({ user, onClose, onSendRequest, isPending }) => {
  const handleSendRequest = useCallback(() => {
    if (!isPending && !user.friend_request_sent && !user.is_friend) {
      onSendRequest(user.id);
    }
  }, [user, isPending, onSendRequest]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-3xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <ImageWithFallback 
            src={user.profile_image_url}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#FF95DD]"
          />
          <button 
            onClick={onClose} 
            className="text-text/50 hover:text-text"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <h2 className="text-text font-lexend font-bold text-2xl mb-2">
          {user.name}
        </h2>
        <p className="text-text/70 font-lexend text-sm mb-4">
          {user.bio || 'No bio available'}
        </p>
        <button
          onClick={handleSendRequest}
          disabled={isPending || user.friend_request_sent || user.is_friend}
          className={`w-full bg-gradient-to-r from-[#FF95DD] to-[#FF5CAA] text-background font-lexend font-medium py-2 px-6 rounded-full hover:opacity-90 transition-opacity ${
            (isPending || user.friend_request_sent || user.is_friend) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? (
            <span>Sending Request...</span>
          ) : user.is_friend ? (
            <>
              <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
              Already Friends
            </>
          ) : (
            <>
              <FontAwesomeIcon 
                icon={user.friend_request_sent ? faCheck : faUserPlus} 
                className="mr-2" 
              />
              {user.friend_request_sent ? 'Request Sent' : 'Send Friend Request'}
            </>
          )}
        </button>
      </div>
    </div>
  );
});

const UserCard = memo(({ 
  user, 
  onSelect, 
  onSendRequest, 
  isPending 
}) => {
  const handleClick = useCallback(() => {
    onSelect(user);
  }, [user, onSelect]);

  const handleSendRequest = useCallback((e) => {
    e.stopPropagation();
    if (!isPending && !user.friend_request_sent && !user.is_friend) {
      onSendRequest(user.id);
    }
  }, [user, isPending, onSendRequest]);

  return (
    <div
      className="bg-background/70 rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-20 h-20 sm:w-32 sm:h-32 mb-4">
        <ImageWithFallback 
          src={user.profile_image_url}
          alt={user.name}
          className="w-full h-full rounded-full object-cover border-4 border-[#FF95DD]"
        />
      </div>
      <h2 className="text-text font-lexend font-bold text-lg sm:text-xl mb-2">{user.name}</h2>
      <p className="text-text/70 font-lexend text-xs sm:text-sm mb-4 line-clamp-2">
        {user.bio || 'No bio available'}
      </p>
      {user.is_friend ? (
        <span className="text-[#FF95DD] font-medium flex items-center gap-2">
          <FontAwesomeIcon icon={faUserFriends} />
          Already Friends
        </span>
      ) : user.friend_request_sent ? (
        <span className="text-[#FF95DD] font-medium flex items-center gap-2">
          <FontAwesomeIcon icon={faCheck} />
          Request Sent
        </span>
      ) : (
        <button 
          className={`bg-gradient-to-r from-[#FF95DD] to-[#FF5CAA] text-background font-lexend font-medium py-2 px-4 sm:px-6 rounded-full flex items-center hover:opacity-90 transition-opacity ${
            isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSendRequest}
          disabled={isPending}
        >
          {isPending ? (
            <span>Sending...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Connect
            </>
          )}
        </button>
      )}
    </div>
  );
});

const SearchInput = memo(({ value, onChange }) => (
  <div className="relative w-full max-w-sm mb-6 sm:mb-12">
    <input
      type="text"
      placeholder="Search users..."
      className="w-full py-2 sm:py-3 px-4 sm:px-6 pr-10 rounded-full border-2 border-[#FF95DD] bg-background/50 text-text focus:outline-none focus:border-[#FF5CAA] transition-all duration-300"
      value={value}
      onChange={onChange}
    />
    <FontAwesomeIcon 
      icon={faSearch} 
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF95DD]" 
    />
  </div>
));

const FriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/friends', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          signal: controller.signal
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching users:', error);
          setError(error.message);
          toast.error('Failed to load users: ' + error.message);
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return searchTerm
      ? users.filter(user => user.name.toLowerCase().includes(searchLower))
      : users;
  }, [users, searchTerm]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSendRequest = useCallback(async (targetUserId) => {
    setPendingRequests(prev => new Set(prev).add(targetUserId));
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/friends/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_user_id: targetUserId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send friend request');

      toast.success('Friend request sent');
      setUsers(prev =>
        prev.map(user => user.id === targetUserId 
          ? { ...user, friend_request_sent: true }
          : user
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  }, [navigate]);

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 sm:px-8 py-12">
      <h1 className="text-text font-lexend font-bold text-2xl sm:text-4xl mb-6 sm:mb-12">
        Find Friends
      </h1>

      <SearchInput value={searchTerm} onChange={handleSearch} />

      <Suspense fallback={<div>Loading...</div>}>
        {isInitialLoading ? (
          <div>Loading friends...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredUsers.map(user => (
              <UserCard 
                key={user.id}
                user={user}
                onSelect={handleUserSelect}
                onSendRequest={handleSendRequest}
                isPending={pendingRequests.has(user.id)}
              />
            ))}
          </div>
        )}
      </Suspense>

      {selectedUser && (
        <UserModal 
          user={selectedUser}
          onClose={handleCloseModal}
          onSendRequest={handleSendRequest}
          isPending={pendingRequests.has(selectedUser.id)}
        />
      )}
    </div>
  );
};

export default FriendsPage;