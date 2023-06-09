import React, {useEffect, useState} from 'react';
const Home = () => {
  return (
    <>
    <div>
      <h1 className='settings-panel-header text-xl font-bold'>Welcome to Project Akiko</h1>
      <div className='settings-panel'>
        <p>This is a work in progress.  Please check back later. To get started click the 'Characters' icon above.</p>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        </div>
      </div>
    </div>
    </>
  );
};
  
export default Home;