import React, { useState, useRef, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import SideMenu from '../SideMenu';

const ProfileSettings = () => {
  const [isProfileSettingsVisible, setIsProfileSettingsVisible] = useState(false);
  const profileSettingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileSettingsRef.current && !profileSettingsRef.current.contains(event.target)) {
        setIsProfileSettingsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileSettingsRef]);

  const handleProfileButtonClick = () => {
    setIsProfileSettingsVisible(true);
  };

  return (
    <>
      <div id='FiMenu' onClick={handleProfileButtonClick}>
        <FiUsers/>
      </div>

      {isProfileSettingsVisible && (
        <div className="profile-settings-popup" ref={profileSettingsRef}>
          <SideMenu/>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
