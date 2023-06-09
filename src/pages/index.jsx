import React, {useEffect, useState} from 'react';
import BackgroundSelector from '../components/menucomponents/BackgroundSelector';
import EndpointSelector from '../components/settingscomponents/EndpointSelector';
import GenSettingsMenu from '../components/GenSettingsMenu';
const Home = () => {
  return (
    <>
    <div>
      <h1 className='settings-panel-header text-xl font-bold'>Welcome to the Akiko Discord Bot UI!</h1>
      <div className='settings-panel'>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          <BackgroundSelector />
          <EndpointSelector />
          <GenSettingsMenu />
        </div>
      </div>
    </div>
    </>
  );
};
  
export default Home;