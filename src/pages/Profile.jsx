import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const scrollContainerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false); 
  const [user, setUser] = useState(null);
  const [errors, setError] = useState({});
  const [friendCount, setFriendCount] = useState(0);
  const [capsuleCount, setCapsuleCount] = useState(0);

  const navigate = useNavigate();

  const storyImages = [
    '/images/story1.jpg',
    '/images/story2.jpg',
    '/images/story3.jpg',
    '/images/story4.jpg',
    '/images/story5.jpg',
    '/images/story6.jpg',
    '/images/story7.jpg',
    '/images/story8.jpg',
    '/images/story9.jpg',
    '/images/story10.jpg',
    '/images/story11.jpg',
    '/images/story12.jpg',
  ];

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found');
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        console.log('User data:', data);

        return fetch('http://127.0.0.1:8000/api/friends/count', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      })
      .then(response => response.json())
      .then(data => {
        setFriendCount(data.count);

        return fetch('http://127.0.0.1:8000/api/capsules/count', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      })
      .then(response => response.json())
      .then(data => {
        setCapsuleCount(data.count);
      })
      .catch(err => {
        setError('Failed to fetch user data');
        console.error('Fetch error:', err);
      });
  }, [navigate]);

  useEffect(() => {
    const checkIfScrollable = () => {
      if (scrollContainerRef.current) {
        setIsScrollable(
          scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
        );
      }
    };
    checkIfScrollable();
    window.addEventListener('resize', checkIfScrollable);
    return () => window.removeEventListener('resize', checkIfScrollable);
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Profile details saved");
    setShowModal(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleProfileVisibilityChange = (visibility) => {
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/user/privacy', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ privacy: visibility.toLowerCase().replace(' ', '_') })
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Profile visibility set to: ${data.privacy}`);
      setShowSettings(false);
      setUser(prevUser => ({ ...prevUser, privacy: data.privacy }));
    })
    .catch(error => {
      console.error('Error updating privacy settings:', error);
    });
  };

  if (!user) {
    return <p className='text-center font-lexend text-2xl md:text-4xl pt-[25%]'>Loading...</p>; 
  }

  return (
    <div className='min-h-screen w-full bg-background flex justify-center p-4 md:p-10'>
      <div className='w-full max-w-7xl bg-background flex flex-col justify-center items-center'>
        <div className='bg-background flex flex-col items-center w-full h-full p-4 md:p-8 shadow-custom rounded-3xl'>
          <div className='flex bg-background flex-col md:flex-row items-center md:items-start w-full md:w-6/6 justify-center space-y-4 md:space-y-0 md:space-x-4'>
            <button className='rounded-full w-24 h-24 md:w-32 md:h-32 bg-background border-[#FF95DD] border-4 flex justify-center shadow-b2779f-custom'>
              <img
                src={user && user.profile_image ? user.profile_image : `${process.env.PUBLIC_URL}/images/DefaultAvatar.jpg`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
            <div className="flex flex-col items-center md:items-start md:pl-4 pt-2 md:pt-4">
              <h1 className='text-text font-lexend font-black text-xl md:text-2xl'>{user ? user.name : 'User'}</h1>
              <div className='flex space-x-4 pt-2'>
                <button className='text-text font-lexend font-medium text-sm hover:underline'>
                  {capsuleCount} Capsules
                </button>
                <button className='text-text font-lexend font-medium text-sm hover:underline'>
                  {friendCount} Friends
                </button>
              </div>
              <p className='text-text font-lexend font-medium text-sm mt-2'>
                Privacy: {user.privacy ? user.privacy.charAt(0).toUpperCase() + user.privacy.slice(1).replace('_', ' ') : 'Public'}
              </p>
            </div>
            <div className='flex flex-wrap justify-center md:justify-start gap-2 mt-4 md:mt-0 relative'>
              <button
                onClick={toggleModal}
                className='flex justify-center items-center px-4 py-2 rounded-xl text-text font-lexend font-regular border-[#FF95DD] border-2 shadow-b2779f-custom'
              >
                Edit Profile
              </button>
              <button className='flex justify-center items-center px-4 py-2 rounded-xl text-text font-lexend font-regular border-[#FF95DD] border-2 shadow-b2779f-custom'>
                History
              </button>
              <button
                className='relative flex justify-center items-center p-2 rounded-xl text-text font-lexend font-regular'
                onClick={toggleSettings}
              >
                <FontAwesomeIcon icon={faCog} size="lg" />
              </button>

              {showSettings && (
                <div className='absolute top-10 right-0 w-48 bg-white rounded-lg shadow-lg z-10'>
                  <button
                    onClick={() => handleProfileVisibilityChange('Private')}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left'
                  >
                    Private
                  </button>
                  <button
                    onClick={() => handleProfileVisibilityChange('Public')}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left'
                  >
                    Public
                  </button>
                  <button
                    onClick={() => handleProfileVisibilityChange('Friends Only')}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left'
                  >
                    Friends Only
                  </button>
                </div>
              )}
            </div>
          </div>

          <Modal show={showModal} onClose={toggleModal} onSave={handleSave} />

          <div className='flex bg-transparent w-full flex-col space-y-4 mt-8'>
            <div className='flex w-full flex-row items-center justify-center'>
              <button className='text-text font-lexend flex border-[#FF95DD] border-[1px] shadow-b2779f-custom p-2 py-1 rounded-xl px-6'>
                HIDE FRIENDS
              </button>
            </div>
            <div className='relative w-full flex flex-col items-center'>
              <div className='w-full md:w-9/12 border-b-2 border-[#FF95DD] mb-4 pb-4'>
                <div
                  className='flex flex-row justify-start overflow-x-auto space-x-4 p-4 scroll-smooth'
                  ref={scrollContainerRef}
                >
                  {storyImages.map((img, index) => (
                    <button key={index} className='flex-shrink-0 rounded-full border-secondary border-2 w-16 h-16 md:w-24 md:h-24 overflow-hidden'>
                      <img
                        src={`${process.env.PUBLIC_URL}${img}`}
                        alt={`Story ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-6 w-full md:w-10/12 justify-center pt-6 md:pt-10">
                <div
                  className="bg-secondary p-4 w-full sm:w-[45%] md:w-[30%] lg:w-[22%] h-[300px] md:h-[350px] flex flex-col rounded-[30px] shadow-md relative"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/bgimage5.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className='w-full flex justify-end'>
                    <button>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </div>
                  <div className='flex flex-col space-y-2 justify-center items-center h-full'>
                    <h2 className='text-text font-lexend font-black text-center text-xl'>
                      FAMILY GATHERING 2024
                    </h2>
                    <div className='w-[90%] h-[1px] bg-text'></div>
                    <p className='text-text font-lexend font-medium text-center text-lg'>
                      Opens In: 99 Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;