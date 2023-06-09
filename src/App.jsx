import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontNav from './components/NavBar';
import Home from './pages';
import Characters from './pages/characters';
import DiscordBot from './pages/discordbot';
import 'tailwindcss/tailwind.css';

function App() {
  const [showNavBar, setShowNavBar] = useState(true);
  
  return (
    <Router>
      <FrontNav showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
      <main
        className="transition-all duration-100"
        style={{ paddingTop: showNavBar ? '.25rem' : '0' }}
      >
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/discordbot" element={<DiscordBot />} />
          <Route path="*" element={<h1 className='settings-panel-header text-xl font-bold'>404: Not Found</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
