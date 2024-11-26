import React, { useState, useEffect, useCallback, useMemo, memo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faUserPlus, 
  faTimes, 
  faCheck, 
  faUserFriends,
  faClock,  
  faUsers,
  faLock,
  faGlobe,
  faUserGroup,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

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
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/friends/stats/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
        toast.error('Failed to load user details');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  const handleSendRequest = useCallback(() => {
    if (!isPending && !user.friend_request_sent && !user.is_friend) {
      onSendRequest(user.id);
    }
  }, [user, isPending, onSendRequest]);

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'private':
        return faLock;
      case 'friends_only':
        return faUserGroup;
      default:
        return faGlobe;
    }
  };

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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-text font-lexend font-bold text-2xl">
              {user.name}
            </h2>
            <FontAwesomeIcon 
              icon={getPrivacyIcon(user.privacy)} 
              className="text-text/50"
              title={`Profile is ${user.privacy}`}
            />
          </div>

          <p className="text-text/70 font-lexend text-sm">
            {user.bio || 'No bio available'}
          </p>

          {isLoading ? (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
  ) : error ? (
    <p className="text-red-500 text-sm">{error}</p>
  ) : userDetails && (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="text-center p-3 bg-background/50 rounded-lg">
        <FontAwesomeIcon icon={faUserFriends} className="text-[#FF95DD] mb-2" />
        <p className="font-bold text-lg text-text">{userDetails.total_friends}</p>
        <p className="text-sm text-text/70">Friends</p>
      </div>
      <div className="text-center p-3 bg-background/50 rounded-lg">
        <FontAwesomeIcon icon={faClock} className="text-[#FF95DD] mb-2" />
        <p className="font-bold text-lg text-text">{user.capsule_count || 0}</p>
        <p className="text-sm text-text/70">Capsules</p>
      </div>
    </div>
  )}

          {user.mutual_friends && user.mutual_friends.length > 0 && (
            <div className="py-4">
              <h3 className="text-sm font-medium text-text/70 mb-2">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                {user.mutual_friends_count} Mutual Friends
              </h3>
              <div className="flex -space-x-2 overflow-hidden">
                {user.mutual_friends.map((friend) => (
                  <ImageWithFallback
                    key={friend.id}
                    src={friend.profile_image_url}
                    alt={friend.name}
                    className="w-8 h-8 rounded-full border-2 border-background"
                    title={friend.name}
                  />
                ))}
                {user.mutual_friends_count > user.mutual_friends.length && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-background">
                    +{user.mutual_friends_count - user.mutual_friends.length}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleSendRequest}
            disabled={isPending || user.friend_request_sent || user.is_friend}
            className={`w-full bg-gradient-to-r from-[#FF95DD] to-[#FF5CAA] text-background font-lexend font-medium py-3 px-6 rounded-full hover:opacity-90 transition-opacity ${
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

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1 
            ? 'text-text/30 cursor-not-allowed' 
            : 'text-[#FF95DD] hover:bg-[#FF95DD]/10'
        }`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      
      <span className="font-lexend text-text">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages 
            ? 'text-text/30 cursor-not-allowed' 
            : 'text-[#FF95DD] hover:bg-[#FF95DD]/10'
        }`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
});

const FriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  
  const USERS_PER_PAGE = 9;

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const offset = (currentPage - 1) * USERS_PER_PAGE;
        const response = await fetch(
          `http://127.0.0.1:8000/api/friends?page=${currentPage}&per_page=${USERS_PER_PAGE}&offset=${offset}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            signal: controller.signal
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setUsers(data.slice(offset, offset + USERS_PER_PAGE));
          setTotalUsers(data.length);
          setTotalPages(Math.ceil(data.length / USERS_PER_PAGE));
        } else if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
          setTotalUsers(data.total || data.users.length);
          setTotalPages(Math.ceil((data.total || data.users.length) / USERS_PER_PAGE));
        } else {
          setUsers([]);
          setTotalUsers(0);
          setTotalPages(1);
          console.error('Unexpected API response structure:', data);
        }
        
        setError(null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching users:', error);
          setError(error.message);
          toast.error('Failed to load users: ' + error.message);
          setUsers([]);
          setTotalUsers(0);
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [navigate, currentPage]);

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = searchTerm
      ? users.filter(user => user.name.toLowerCase().includes(searchLower))
      : users;
    
    const filledArray = [...filtered];
    while (filledArray.length < USERS_PER_PAGE) {
      filledArray.push(null); 
    }
    
    return filledArray;
  }, [users, searchTerm]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
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
        Array.isArray(prev) ? prev.map(user => 
          user?.id === targetUserId 
            ? { ...user, friend_request_sent: true }
            : user
        ) : []
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
    if (user) setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
  }, []);
  const EmptyCard = memo(() => (
    <div className="bg-background/70 rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow-lg h-full">
      <div className="w-20 h-20 sm:w-32 sm:h-32 mb-4 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
    </div>
  ));
 return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 sm:px-8 py-12">
      <h1 className="text-text font-lexend font-bold text-2xl sm:text-4xl mb-6 sm:mb-12">
        Find Friends
      </h1>

      <SearchInput value={searchTerm} onChange={handleSearch} />

      <Suspense fallback={<div>Loading...</div>}>
        {isInitialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {Array(USERS_PER_PAGE).fill(null).map((_, index) => (
              <EmptyCard key={`loading-${index}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : totalUsers === 0 ? (
          <div className="text-text/70">No users found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {filteredUsers.map((user, index) => (
                user ? (
                  <UserCard 
                    key={user.id}
                    user={user}
                    onSelect={handleUserSelect}
                    onSendRequest={handleSendRequest}
                    isPending={pendingRequests.has(user.id)}
                  />
                ) : (
                  <EmptyCard key={`empty-${index}`} />
                )
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
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