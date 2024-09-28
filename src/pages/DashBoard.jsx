import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faRotate, faBell, faExpand, faStar, faUser } from '@fortawesome/free-solid-svg-icons';  
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CapsuleStatsChart from '../components/CapsuleStats';
function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("MARCH 2024");
  const [isClosest, setIsClosest] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
  };

  const handleSwap = () => {
    setIsClosest(!isClosest);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const months = [
    "JANUARY 2024",
    "FEBRUARY 2024",
    "MARCH 2024",
    "APRIL 2024",
    "MAY 2024",
    "JUNE 2024"
  ];
  const percentage = 100;

  return (
    <div className='h-screen bg-background flex flex-col font-lexend'>
      <div className='bg-background w-full h-6/6 flex'>
        <div className='w-1/3 bg-background flex p-8 items-end flex-col space-y-6'>
          
          <div className='relative bg-accent p-4 w-11/12 rounded-2xl shadow-secondary'>
            <div className='flex items-center p-2'>
       
              <div className='relative rounded-xl w-7/12 p-2 bg-secondary text-text font-bold text-center'>
                <div onClick={toggleDropdown} className="cursor-pointer flex justify-center items-center">
                  {selectedMonth}
                  <svg
                    className={`ml-2 w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                {isDropdownOpen && (
                  <ul className="absolute left-0 top-full mt-2 bg-accent border border-gray-300 rounded-lg w-full z-10">
                    {months.map((month) => (
                      <li
                        key={month}
                        onClick={() => handleMonthSelect(month)}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        {month}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className='ml-auto p-4 w-10 h-10 rounded-full flex items-center justify-center'>
                <FontAwesomeIcon icon={faExpand} className="text-text size-6" />
              </button>
            </div>
            <div className='p-2'>
              <h2 className='text-text mt-16 text-[16px] font-black italic'>Active Capsules</h2>
              <h1 className='text-text text-5xl font-black'>70</h1>
            </div>
      
            <div className='absolute bottom-4 right-4 w-16 h-16 font-extrabold bg-primary rounded-full'>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: '22px',
                  pathColor: '#5E3762',
                  textColor: 'white',
                  trailColor: '#A7ACCD',
                })}
              />
            </div>
          </div>

          <div className='relative bg-accent p-4 w-11/12 rounded-2xl shadow-secondary'>
            <div className='flex items-center p-2'>
              <div className='relative rounded-xl w-7/12 p-2 bg-secondary text-text font-bold text-center'>
                <div onClick={handleSwap} className="cursor-pointer flex justify-center items-center">
                  {isClosest ? 'CLOSEST' : 'FURTHEST'}
                  <FontAwesomeIcon
                    icon={faRotate}
                    className="ml-2 w-4 h-4 transition-transform duration-300"
                  />
                </div>
              </div>
              <button className='ml-auto p-4 w-10 h-10 rounded-full flex items-center justify-center'>
                <FontAwesomeIcon icon={faBell} className="text-white size-6" />
              </button>
            </div>
            <div className='p-2'>
              <h2 className='text-text mt-16 text-[16px] font-black italic'>YOUR CAPSULE OPENS IN</h2>
              <h1 className='text-text text-3xl font-black'>21:21:21:32</h1>
            </div>
            <div className='absolute bottom-4 right-4 w-16 h-16 font-extrabold bg-primary rounded-full'>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: '22px',
                  pathColor: '#5E3762',
                  textColor: 'white',
                  trailColor: '#A7ACCD',
                })}
              />
            </div>
          </div>

          <div className='relative bg-accent p-4 w-11/12 rounded-2xl shadow-secondary'>
  <div className='flex items-center p-2'>
    <button className='ml-auto p-4 w-10 h-10 rounded-full flex items-center justify-center'>
      <FontAwesomeIcon icon={faExpand} className="text-white size-6" />
    </button>
  </div>
  <div className='flex flex-col items-center justify-center p-4'>
    <div className='flex flex-row space-x-4'>
      <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
        <FontAwesomeIcon icon={faStar} className='text-white' />
      </div>
      <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
        <FontAwesomeIcon icon={faStar} className='text-white' />
      </div>
      <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
        <FontAwesomeIcon icon={faStar} className='text-white' />
      </div>
    </div>
    <div className=' mt-4 w-full'>
      <h2 className='text-text text-left text-[16px] font-black italic '>Achievements Unlocked</h2>
      <h1 className='text-text text-3xl font-black '>35/70</h1>
    </div>
  </div>
  <div className='absolute bottom-4 right-4 w-16 h-16 font-extrabold bg-primary rounded-full'>
    <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      styles={buildStyles({
        textSize: '22px',
        pathColor: '#5E3762',
        textColor: 'white',
        trailColor: '#A7ACCD',
      })}
    />
  </div>
</div>
</div>
    
        <div className='w-2/3 bg-background flex m-8 flex-col'>
        <div className='w-full h-4/6 flex bg-background rounded-2xl mb-6 shadow-custom'>
  <CapsuleStatsChart />
</div>
          
          <div className='flex space-x-6'>
            <div className='bg-accent p-4 w-1/2 rounded-2xl shadow-secondary'>
              <div className='flex items-center p-2'>
                <div className='rounded-xl w-7/12 p-2 text-text text-xl font-extrabold '>FRIENDS</div>
              </div>
              <div className='flex flex-row justify-center p-6 gap-2'>
                  <div><FontAwesomeIcon icon={faUser} className="text-text size-6 outline rounded-full p-2" /></div>
                  <div><FontAwesomeIcon icon={faUser} className="text-text size-6 outline rounded-full p-2" /></div>
                  <div><FontAwesomeIcon icon={faUser} className="text-text size-6 outline rounded-full p-2" /></div>
              </div>
              <div className='flex flex-row justify-between w-4/6 ml-3 font-light text-text'>
                <p>Added</p>
                <p>Removed</p>
                <p>Blocked</p>
              </div>
              <div className='flex flex-row gap-6 justify-between w-4/6 ml-6'>
                <h1 className='text-text font-extrabold text-xl'>82</h1>
                <h1 className='text-text font-extrabold'>82</h1>
                <h1 className='text-text font-extrabold'>82</h1>
              </div>
              
            </div>

            <div className='bg-accent p-1 w-1/2 rounded-2xl shadow-secondary'>
  <div className='flex items-center p-2'>
    <button className='ml-auto p-4 w-4 h-4 rounded-full flex items-center justify-center'>
      <FontAwesomeIcon icon={faExpand} className="text-white size=6" />
    </button>
  </div>

  <div className='p-10'>
    <h2 className='text-text mt-4 text-[20px] font-black italic'>Missions Completed</h2>
    <h1 className='text-text text-3xl font-black'>5/10</h1>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
