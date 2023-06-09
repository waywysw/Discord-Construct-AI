import React, { useState, useEffect, useRef } from "react";
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { RxDiscordLogo } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { AiFillUnlock, AiFillLock } from 'react-icons/ai';

const Navbar = ({showNavBar, setShowNavBar}) => {
  const navbarRef = useRef(null);
  const [doSlide, setDoSlide] = useState(() => {
    const storedDoSlide = localStorage.getItem('doSlide');
    return storedDoSlide === null ? true : storedDoSlide === 'true';
  });

  const handleMouseMove = (e) => {
    if (e.clientY <= 10) {
      setShowNavBar(true);
    } else {
      if (!doSlide) {
        const navbar = navbarRef.current;
        if (navbar) {
          const rect = navbar.getBoundingClientRect();
          const isMouseInside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (!isMouseInside) {
            setShowNavBar(false);
          }
        }
      }
    }
  };  

  const toggleMenu = () => {
    setShowNavBar(!showNavBar);
  };

  const toggleSlide = () => {
    setDoSlide((prevDoSlide) => {
      const newDoSlide = !prevDoSlide;
      localStorage.setItem('doSlide', newDoSlide ? 'true' : 'false');
      if (newDoSlide) {
        setShowNavBar(true);
      }
      return newDoSlide;
    });
  };  
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [doSlide]);

  return (
    <>
      <button
        className="fixed z-50 top-4 right-4 md:hidden"
        onClick={toggleMenu}
        style={{ color: 'var(--selected-text-color)' }}
      >
        <span className="bg-transparent rounded text-2xl">&#9776;</span>
      </button>
        {showNavBar && (
        <div 
        ref={navbarRef}
        className={'relative z-50 md:w-1/2 lg:w-1/2 rounded-br-[4rem] rounded-bl-[4rem] shadow-md backdrop-blur-md left-1/2 transform -translate-x-1/2 top-0 border-1 border-solid border-gray-500'}
        style={{
          backgroundColor: 'var(--selected-color)',
        }}>
          <div className="flex justify-center gap-10 w-10/12 mx-auto py-2">
            <Link
              title="Home"
              className="bg-transparent rounded p-2 w-60 flex justify-center cursor-pointer hover:bg-selected-color hover:rounded hover:shadow-md hover:backdrop-blur-sm"
              style={{ color: 'var(--selected-text-color)' }}
              to="/"
            >
              <HomeIcon className="w-8 h-8"/>
            </Link>
            <Link
              title="Characters"
              className="bg-transparent rounded p-2 w-60 flex justify-center cursor-pointer hover:bg-selected-color hover:rounded hover:shadow-md hover:backdrop-blur-sm"
              style={{ color: 'var(--selected-text-color)' }}
              to="/characters"
            >
              <UserGroupIcon className="w-8 h-8"/>
            </Link>
            <Link
              title="Discord Bot"
              className="bg-transparent rounded p-2 w-60 flex justify-center cursor-pointer hover:bg-selected-color hover:rounded hover:shadow-md hover:backdrop-blur-sm"
              style={{ color: 'var(--selected-text-color)' }}
              to="/discordbot"
            >
              <RxDiscordLogo className="w-8 h-8"/>
            </Link>
          </div>
          <div>
            <button className="absolute top-0 right-0 p-2" onClick={() => toggleSlide()}>
              { doSlide ? <AiFillLock className="w-6 h-6"/> : <AiFillUnlock className="w-6 h-6"/>}
            </button>
          </div>
        </div>
        )}
    </>
  );
};

export default Navbar;
