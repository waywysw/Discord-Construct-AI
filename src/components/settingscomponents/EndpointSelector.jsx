import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Connect from '../Connect';
import HordeModelSelector from './HordeModelSelector';
import { getDiscordSettings, saveDiscordConfig } from '../discordbot/dbotapi';

const EndpointSelector = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      var localOption = localStorage.getItem('endpointType');
      if (localOption != null){
        setSelectedOption({value: localOption, label: localOption});
        setInputValue(localStorage.getItem('endpoint'));
      };
    }, []);

    const handleOptionChange = (selectedOption) => {
      setSelectedOption(selectedOption);
      setInputValue(getDefaultInputValue(selectedOption.value));
    };
    
    const handleConnectClick = async () => {
      if(selectedOption.value === 'Horde' || selectedOption.value === 'OAI') {
        localStorage.setItem('endpoint', inputValue);
        localStorage.setItem('endpointType', selectedOption.value);
        localStorage.setItem('password', password);
        setSelectedOption(localStorage.getItem('endpointType'), localStorage.getItem('endpoint'));
        let discord = await getDiscordSettings();
        discord.data.endpointType = selectedOption.value
        discord.data.endpoint = inputValue;
        discord.data.password = password;
        await saveDiscordConfig(discord.data);
      } else {
        const url = ensureUrlFormat(inputValue)
        setInputValue(url);
        localStorage.setItem('endpointType', selectedOption.value);
        localStorage.setItem('endpoint', inputValue);
        localStorage.setItem('password', password);
        setSelectedOption(localStorage.getItem('endpointType'), localStorage.getItem('endpoint'));
        let settings = await getDiscordSettings();
        settings.data.endpoint = url;
        settings.data.endpointType = selectedOption.value;
        settings.data.password = password;
        await saveDiscordConfig(settings.data);
      };
    };

    function ensureUrlFormat(str) {
        let url;
        try {
          url = new URL(str);
        } catch (error) {
          // If the provided string is not a valid URL, create a new URL
          url = new URL(`http://${str}/`);
        }
      
        return url.href;
      }
    
    const getDefaultInputValue = (option) => {
        switch (option) {
          case 'Kobold':
            return '';
          case 'Ooba':
            return '';
          case 'Horde':
            return '0000000000';
          case 'OAI':
            return '';
          case 'P-OAI':
            return '';
          case 'P-Claude':
            return '';
          default:
            return '';
        }
      };
    
    const options = [
        { value: 'Kobold', label: 'Kobold' },
        { value: 'Ooba', label: 'OobaTextUI' },
        { value: 'Horde', label: 'Horde' },
        { value: 'OAI', label: 'OAI' },
        { value: 'P-OAI', label: 'Proxy - OpenAI' },
        { value: 'P-Claude', label: 'Proxy - Claude' },
    ];
  
    return (
      <>
        <div className="settings-box">
          <div className='mb-4'>
            <h2 className='text-xl font-bold mb-4 text-center mx-auto'>Text Generation Endpoint</h2>
          </div>
        <div id='endpoint-container'>
          <Select
          id="options"
          options={options}
          value={selectedOption}
          onChange={handleOptionChange}
          placeholder={selectedOption}
          />
          {selectedOption && selectedOption.value !== 'AkikoBackend' &&(
              <input
              id="inputValue"
              type="text"
              label="If using the Kobold or Ooba endpoint, enter the URL here. If using the OpenAI endpoint, enter your API key here. If using Horde, enter your API key or leave empty for anonymous mode."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={getDefaultInputValue(selectedOption.value)}
              />
          )}
          {selectedOption && (selectedOption.value === 'P-OAI' || selectedOption.value === 'P-Claude') &&(
            <div className='relative flex flex-col text-center'>
              <label htmlFor="inputValue" className='text-xl text-selected-text'>Proxy Password:</label>
              <input
              id="inputValue"
              type="text"
              label="Put in the proxy password here."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={getDefaultInputValue(selectedOption.value)}
              />
            </div>
          )
          }
          {selectedOption && (
              <button className="connect-button" onClick={() => handleConnectClick()}>Connect</button>
          )}
          <Connect/>
          {selectedOption && selectedOption.value === 'Horde' && (
            <HordeModelSelector/>
          )}
        </div>
        </div>
        </>
    );
  };
  
  export default EndpointSelector;
  