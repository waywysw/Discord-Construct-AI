import React, { useState, useEffect, useRef } from 'react';
import { RxDiscordLogo } from 'react-icons/rx';
import { getBotStatus, getDiscordSettings, startDisBot, stopDisBot, saveDiscordConfig, getAvailableChannels, getBotInvite } from '../components/discordbot/dbotapi';
import { FiRefreshCcw, FiSave } from 'react-icons/fi';
import { getSettings } from '../components/chatapi';
import CurrentCharacter from '../components/charactercomponents/CurrentCharacter';
import GenSettingsMenu from '../components/GenSettingsMenu';


const DiscordBot = () => {
  const [botToken, setBotToken] = useState('');
  const [isOn, setIsOn] = useState(false);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [endpointType, setEndpointType] = useState('');
  const [settings, setSettings] = useState({});
  const [activeServerId, setActiveServerId] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState(new Set());
  const [botInvite, setBotInvite] = useState('');
  const [appId, setAppId] = useState('');

  const handleToggle = async () => {
    if (isOn) {
      await stopDisBot();
      setIsOn(false);
    } else {
      await startDisBot();
      setIsOn(true);
    }
  };

  const settingsPanelRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBotInvite(appId);
      setBotInvite(response);
    };
    fetchData();
  }, [isOn]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBotStatus();
      setIsOn(response);
      const data = await getDiscordSettings();
      setBotToken(data.token);
      setAppId(data.appId);
      setSelectedChannels(new Set(data.channels));
      if (response) {
        const channelsData = await getAvailableChannels();
        setAvailableChannels(channelsData.data);
        console.log(channelsData)
      }
      var localOption = localStorage.getItem('endpointType');
      if (localOption != null){
        setEndpointType(localOption);
        setEndpoint(localStorage.getItem('endpoint'));
      }
      var localChar = localStorage.getItem('selectedCharacter');
      if (localChar != null){
        setSelectedCharacter(localChar);
      }
      var settings = getSettings(localOption);
      if (settings != null){
        setSettings(settings);
      }
    };
    fetchData();
  }, []);
  
  const refreshChannels = async () => {
    const channelsData = await getAvailableChannels();
    setAvailableChannels(channelsData.data);
  }

  const saveData = async () => {
    var localOption = localStorage.getItem('endpointType');
    if (localOption != null){
      setEndpointType(localOption);
      setEndpoint(localStorage.getItem('endpoint'));
    }
    var localChar = localStorage.getItem('selectedCharacter');
    if (localChar != null){
      setSelectedCharacter(localChar);
    }
    var settings = getSettings(localOption);
    if (settings != null){
      setSettings(settings);
    }
    var hordeModel = localStorage.getItem('hordeModel');
    let data = {
      "token" : botToken,
      "appId" : appId,
      "channels" : [...selectedChannels],
      "charId" : selectedCharacter,
      "endpoint" : endpoint,
      "endpointType" : endpointType,
      "hordeModel" : hordeModel,
      "settings" : settings
    }
    saveDiscordConfig(data);
  };  

  const handleChannelClick = (channelId) => {
    setSelectedChannels(prevSelectedChannels => {
      // We make a new copy of the set to avoid mutating state directly
      const updatedChannels = new Set(prevSelectedChannels);
  
      if (prevSelectedChannels.has(channelId)) {
        // Remove channel from selected channels
        updatedChannels.delete(channelId);
      } else {
        // Add channel to selected channels
        updatedChannels.add(channelId);
      }
      return updatedChannels;
    });
  };

  return (
    <>
      <h1 className='settings-panel-header text-xl font-bold'>Discord Bot Configuration</h1>
      <div className='settings-panel' ref={settingsPanelRef}>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          <div className="settings-box" id='on-switch'>
            <h2 className='text-xl font-bold mb-4 text-center mx-auto'>On/Off Switch</h2>
            <RxDiscordLogo className="discord-logo" />
            <button className={`discord-button ${isOn ? 'discord-button-on' : ''}`} onClick={handleToggle}>
              {isOn ? 'ON' : 'OFF'}
            </button>
            {isOn ? 
            <button>
              <a href={botInvite} target="_blank" rel="noreferrer" className="aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text">Invite Bot</a>
            </button>
            :
            <></>
            }
          </div>
          <div className="settings-box" id='bot-token'>
            <h2 className='text-xl font-bold mb-4 text-center mx-auto'>Discord Bot Token</h2>
            <div className="input-group">
              <input type="text" value={botToken} onChange={(event) => setBotToken(event.target.value)} />
            </div>
          </div>
          <div className="settings-box" id='appid'>
            <h2 className='text-xl font-bold mb-4 text-center mx-auto'>Discord Application ID</h2>
            <div className="input-group">
              <input type="text" value={appId} onChange={(event) => setAppId(event.target.value)} />
            </div>
          </div>
          <div className="settings-box" id='available-channels'>
            <h2 className='text-xl font-bold mb-4 text-center mx-auto'>Available Channels</h2>
            {availableChannels &&
              availableChannels.map(server => (
                <div key={server.id} className='bg-selected-bb-color p-4 rounded-lg shadow-md border-2 border-solid border-gray-500'>
                  <h3 className='text-selected-text font-bold' onClick={() => setActiveServerId(server.id !== activeServerId ? server.id : null)}>
                    {server.name} ({server.id}) {activeServerId === server.id ? "-" : "+"}
                  </h3>
                  {activeServerId === server.id && (
                    <div style={{ maxHeight: '20rem', overflowY: 'scroll' }}>
                      <ul>
                        {server.channels.map(channel => (
                          <li 
                            key={channel.id} 
                            className={`p-4 rounded-lg shadow-md border-2 border-solid ${selectedChannels.has(channel.id) ? 'border-green-500' : 'border-gray-500'} `}
                            onClick={() => handleChannelClick(channel.id)}
                          >
                            {channel.name} ({channel.id})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            <button className="aspect-w-1 aspect-h-1 mt-4 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text" onClick={() => refreshChannels()}>
              <FiRefreshCcw className="react-icon"/>
            </button>
          </div>
          {selectedCharacter && 
            <div className="settings-box" id='character'>
              <h2 className='text-xl font-bold mb-4 text-center mx-auto'>Currently Selected Character</h2>
              <CurrentCharacter Character={selectedCharacter} />
            </div>
          }
          <div className="settings-box" id='settings'>
            <h2 className="text-xl font-bold mb-4 text-center mx-auto">Generation Settings</h2>
            <GenSettingsMenu />
          </div>
        </div>
        <div className="items-center flex flex-col mt-4">
            <button className="aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text" onClick={(event) => saveData()}>
              <FiSave className="react-icon"/>
            </button>
        </div>
      </div>
    </>
  );
};

export default DiscordBot;