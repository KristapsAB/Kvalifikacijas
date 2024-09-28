import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const scrollContainerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setError] = useState({});

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
    document.body.style.overflow = 'hidden';
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

  if (!user) {
    return <p className='text-center font-lexend text-4xl pt-[25%]'>Skibidisigm🐺🥶</p>; 
  }

  return (
    <div className='h-screen w-screen bg-background flex justify-center pt-10'>
      <div className='w-[80%] h-[90%] bg-background flex flex-col justify-center items-center'>
        <div className='bg-background flex flex-col items-center w-full h-full p-5 shadow-custom rounded-3xl'>
          <div className='flex bg-background h-1/6 flex-row items-start w-4/6 space-x-4'>
            <button className='rounded-full w-[130px] h-[130px] bg-background border-[#FF95DD] border-4 flex justify-center shadow-b2779f-custom'>
              <img
                src={`${process.env.PUBLIC_URL}/images/LoginImage.jpg`}
                alt="Login Visual"
                className="w-full h-full object-cover rounded-[90px]"
              />
            </button>
            <div className="flex flex-col pl-12 pt-4">
              <h1 className='text-text font-lexend font-black text-xl'>{user ? user.name : 'User'}</h1>
              <div className='flex space-x-4 pt-2'>
                <button className='text-text font-lexend font-medium text-sm hover:underline'>
                  8 Capsules
                </button>
                <button className='text-text font-lexend font-medium text-sm hover:underline'>
                  52 Friends
                </button>
              </div>
            </div>
            <button
              onClick={toggleModal}
              className='flex justify-center items-center px-4 mt-2 py-2 rounded-xl text-text font-lexend font-regular border-[#FF95DD] border-2 shadow-b2779f-custom'
            >
              Edit Profile
            </button>
            <button className='flex justify-center items-center px-8 mt-2 py-2 rounded-xl text-text font-lexend font-regular border-[#FF95DD] border-2 shadow-b2779f-custom'>
              History
            </button>
            <button className='flex justify-center items-center px-4 mt-2 py-2 rounded-xl text-text font-lexend font-regular'>
              <FontAwesomeIcon icon={faCog} size="2xl" />
            </button>
          </div>

          <Modal show={showModal} onClose={toggleModal} onSave={handleSave} />

          <div className='flex bg-transparent w-full h-5/6 flex-col space-y-4'>
            <div className='flex w-full h-[12%] flex-row items-center space-x-4 justify-center'>
              <button className='text-text font-lexend flex border-[#FF95DD] border-[1px] shadow-b2779f-custom p-2 py-1 rounded-xl px-6'>
                HIDE FRIENDS
              </button>
            </div>
            <div className='relative w-full flex flex-col items-center'>
              <div className='w-9/12 border-b-2 border-[#FF95DD] mb-4 pb-4'>
                <div
                  className='flex flex-row justify-start overflow-x-auto space-x-4 p-4 scroll-smooth'
                  ref={scrollContainerRef}
                  style={{ width: 'calc(100px * 6 + 1rem * 5)', margin: '0 auto' }}
                >
                  {storyImages.map((img, index) => (
                    <button key={index} className='flex-shrink-0 rounded-full border-secondary border-2 w-[100px] h-[100px] overflow-hidden'>
                      <img
                        src={`${process.env.PUBLIC_URL}${img}`}
                        alt={`Story ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-6 w-10/12 justify-center pt-10">
                <div
                  className="bg-secondary p-4 w-[22%] h-[350px] flex flex-col rounded-[30px] shadow-md relative"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/bgimage5.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className='w-full flex justify-end'>
                    <button>
                      <FontAwesomeIcon icon={faEllipsisV} size="2xl" color='white' />
                    </button>
                  </div>
                  <div className='flex flex-col items-center justify-center flex-grow'>
                    <div className='flex flex-col items-center relative'>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/bgCApsule2.jpg`}
                        alt="Left Image"
                        className='w-[80px] h-[80px] object-cover absolute left-[-15px] top-[20px] z-10 blur-sm'
                      />
                      <img
                        src={`${process.env.PUBLIC_URL}/images/bgCapsule.jpg`}
                        alt="Central Image"
                        className='w-[120px] h-[100px] object-cover mb-4 z-20 blur-[2px]'
                      />
                      <img
                        src={`${process.env.PUBLIC_URL}/images/bgCApsule.jpg`}
                        alt="Right Image"
                        className='w-[80px] h-[80px] object-cover absolute right-[-15px] top-[20px] z-10 blur-sm'
                      />
                      <div className='flex flex-col items-center space-y-4 pt-4'>
                        <h1 className='text-white font-bold text-lg'>FAMILY GATHERING 2024</h1>
                        <p className='text-white font-medium text-sm'>Opens In 364 Days</p>
                      </div>
                    </div>
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
