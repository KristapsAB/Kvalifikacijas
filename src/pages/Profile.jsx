import React, { useState, useEffect, useRef } from 'react';
import { Settings, MoreVertical, Edit2, History, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; 
import AnimatedCapsule from '../components/AnimatedCapsule';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [errors, setErrors] = useState({});
  const [friendCount, setFriendCount] = useState(0);
  const [capsuleCount, setCapsuleCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [imgSrc, setImgSrc] = useState('/images/DefaultAvatar.jpg');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [showCapsule, setShowCapsule] = useState(false);
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  const capsules = [
    {
      id: 1,
      title: 'Family Gathering 2024',
      daysLeft: 99,
      images: [
        {
          src: '/images/bgimage5.jpg',
          caption: 'Family BBQ',
          date: 'June 15, 2024'
        },
        {
          src: '/images/bgCapsule.jpg',
          caption: 'Pool Party',
          date: 'June 16, 2024'
        },
      ]
    },
    {
      id: 2,
      title: 'Vacation 2023',
      daysLeft: 150,
      images: [
        {
          src: '/images/vacation1.jpg',
          caption: 'Beach Time',
          date: 'August 5, 2023'
        },
        {
          src: '/images/vacation2.jpg',
          caption: 'Mountain Hiking',
          date: 'August 7, 2023'
        },
      ]
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('Access Token:', token);
    if (!token) {
      setErrors(prev => ({ ...prev, auth: 'No access token found' }));
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setUser(data);
        if (data.profile_image) {
          setImgSrc(`http://127.0.0.1:8000/storage/${data.profile_image}`);
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, user: 'Failed to fetch user data' }));
        console.error('Fetch error:', err);
      }
    };

    const fetchAcceptedFriends = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/friends/accepted', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setFriends(data);
          setFriendCount(data.length);
        } else {
          console.error('Received non-array friends data:', data);
          setFriends([]);
          setFriendCount(0);
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, friends: 'Error fetching friends' }));
        console.error('Error fetching friends:', err);
      }
    };

    const fetchCounts = async () => {
      try {
        const [friendsRes, capsulesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/friends/count', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/api/capsules/count', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        const [friendsData, capsulesData] = await Promise.all([
          friendsRes.json(),
          capsulesRes.json()
        ]);

        setFriendCount(friendsData.count);
        setCapsuleCount(capsulesData.count);
      } catch (err) {
        setErrors(prev => ({ ...prev, counts: 'Error fetching counts' }));
        console.error('Error fetching counts:', err);
      }
    };

    fetchUserData();
    fetchAcceptedFriends();
    fetchCounts();
  }, [navigate]);

  // Click outside settings handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrivacyChange = async (privacy) => {
    const token = localStorage.getItem('access_token');
    console.log(token);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/privacy', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privacy: privacy.toLowerCase().replace(' ', '_') })
      });
      const data = await response.json();
      setUser(prev => ({ ...prev, privacy: data.privacy }));
      setShowSettings(false);
    } catch (err) {
      console.error('Error updating privacy:', err);
    }
  };

  const handleEditProfile = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);

  const handleSaveProfile = (updatedUser) => {
    setUser(prevUser => ({
      ...prevUser,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
      email: updatedUser.email,
      bio: updatedUser.bio
    }));
    if (updatedUser.image) {
      setImgSrc(URL.createObjectURL(updatedUser.image));
    }
    setShowEditModal(false);
  };

  const handleCapsuleClick = (capsule) => {
    setSelectedCapsule(capsule);
    setShowCapsule(true);
  };

  const handleCloseCapsule = () => {
    setSelectedCapsule(null);
    setShowCapsule(false);
  };
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }
  const handleViewAllFriends = () => {
    setShowFriendsModal(true);
  };

  const handleCloseFriendsModal = () => {
    setShowFriendsModal(false);
  };


  return (
    <div className="min-h-screen bg-background font-lexend text-text">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-background rounded-2xl shadow-custom p-6 md:p-8">
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-pink-300 shadow-lg">
                <img
                  src={imgSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setImgSrc('/images/DefaultAvatar.jpg')}
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full text-text hover:bg-pink-600 transition-colors">
                <Camera size={20} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-text">{user.name}</h1>
              <div className="mt-2 space-x-6">
                <button className=" hover:text-secondary transition-colors">
                  {capsuleCount} Capsules
                </button>
                <button className=" hover:text-secondary transition-colors">
                  {friendCount} Friends
                </button>
              </div>
              <p className="mt-2 ">
                Privacy: {user.privacy ? user.privacy.charAt(0).toUpperCase() + user.privacy.slice(1).replace('_', ' ') : 'Public'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 border-2 border-btnOutline rounded-xl  hover:text-gray-400  transition-colors"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 border-2 border-btnOutline rounded-xl  hover:text-gray-400 transition-colors">
                <History size={18} />
                History
              </button>
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2"
                >
                   <Settings size={24} color='white' className="text-gray-600" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-backgrond rounded-lg shadow-lg z-10 py-1">
                    {['Private', 'Public', 'Friends Only'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handlePrivacyChange(option)}
                        className="block w-full px-4 py-2 text-sm  hover:bg-secondary text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-secondary pt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Friends ({friends.length})</h2>
          {friends.length > 0 && (
            <button 
              onClick={handleViewAllFriends}
              className="text-pink-500 hover:text-pink-600 transition-colors"
            >
              View All
            </button>
          )}
        </div>
  {friends.length > 0 ? (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {friends.map((friend) => (
        <div key={friend.id} className="flex-shrink-0 flex flex-col items-center m-1">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-pink-200">
            <img
              src={friend.profile_image_url || '/images/DefaultAvatar.jpg'}
              alt={friend.name}
              className="w-24 h-24 object-cover" 
              onError={(e) => { e.target.src = '/images/DefaultAvatar.jpg'; }}
            />
          </div>
          <p className="mt-2 text-center text-sm truncate w-24">{friend.name}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      No friends added yet
    </div>
  )}
</div>

          <div className="mt-8 border-t border-secondary pt-8">
            <h2 className="text-xl font-semibold mb-6">Time Capsules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {capsules.map((capsule) => (
                <div
                  key={capsule.id}
                  className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => handleCapsuleClick(capsule)}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${capsule.images[0].src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{capsule.title}</h3>
                      <div className="w-full h-px bg-white opacity-50 mb-2"></div>
                      <p className="text-lg">Opens In: {capsule.daysLeft} Days</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
        initialData={{
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          email: user.email,
          bio: user.bio || '',
        }}
      />

{showCapsule && selectedCapsule && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
    <div className="relative w-full h-[90vh] max-w-7xl mx-auto">
      <AnimatedCapsule images={selectedCapsule.images} />
      
      {/* Title and info */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 className="text-2xl font-lexend font-bold text-text mb-2">
          {selectedCapsule.title}
        </h2>
        <p className="text-primary">
          Opens in {selectedCapsule.daysLeft} days
        </p>
      </div>
      
      {/* Close button */}
      <button
        onClick={handleCloseCapsule}
        className="absolute top-6 right-6 p-2 rounded-full bg-secondary/30 hover:bg-secondary/50 transition-all border border-btnOutline z-10"
      >
        <X size={24} className="text-text" />
      </button>
    </div>
    
  </div>
  
)}

{showFriendsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-custom p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">All Friends</h2>
              <button
                onClick={handleCloseFriendsModal}
                className="p-2 rounded-full bg-secondary/30 hover:bg-secondary/50 transition-all border border-btnOutline"
              >
                <X size={24} className="text-text" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-pink-200">
                    <img
                      src={friend.profile_image_url || '/images/DefaultAvatar.jpg'}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/DefaultAvatar.jpg'; }}
                    />
                  </div>
                  <p className="mt-2 text-center text-sm truncate w-full">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;