import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Connect from '../Connect';
import HordeModelSelector from '../settingscomponents/HordeModelSelector';

const ConnectMenu = ({setToggleConnectMenu}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const closeOnEscapeKey = e => e.key === "Escape" ? setToggleConnectMenu(false) : null;
        document.body.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, []);

    useEffect(() => {
      var localOption = localStorage.getItem('endpointType');
      if (localOption != null){
        setSelectedOption({value: localOption, label: localOption});
        setInputValue(localStorage.getItem('endpoint'));
      }
    }, []);

    const handleOptionChange = (selectedOption) => {
      setSelectedOption(selectedOption);
      setInputValue(getDefaultInputValue(selectedOption.value));
    };
    
    const handleConnectClick = () => {
      if(selectedOption.value === 'Horde') {
        localStorage.setItem('endpoint', inputValue);
        localStorage.setItem('endpointType', selectedOption.value);
        setSelectedOption(localStorage.getItem('endpointType'), localStorage.getItem('endpoint'));
      } else {
        const url = ensureUrlFormat(inputValue)
        setInputValue(url);
        localStorage.setItem('endpointType', selectedOption.value);
        localStorage.setItem('endpoint', inputValue);
        setSelectedOption(localStorage.getItem('endpointType'), localStorage.getItem('endpoint'));
      }
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
          case 'AkikoBackend':
            return '' ;
          case 'Horde':
            return '0000000000';
          case 'OpenAI':
            return '';
          default:
            return '';
        }
      };
    
    const options = [
        { value: 'Kobold', label: 'Kobold' },
        { value: 'Ooba', label: 'OobaTextUI' },
        { value: 'Horde', label: 'Horde' },
        { value: 'OAI', label: 'OpenAI' }
    ];
    
    const handleClose = () => {
      setToggleConnectMenu(false);
    };

    return (
      <div className="modal-overlay">
        <div className="relative flex flex-col items-center justify-center p-10 bg-selected text-selected-text rounded shadow-lg border-1 border-solid border-gray-500">
          <span className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-600" onClick={handleClose}>&times;</span>
            <h2 className="mb-4 text-2xl">Text Generation Endpoint</h2>
            <div id='endpoint-container'>
            <form onSubmit={handleConnectClick}>
            <Select
            id="options"
            options={options}
            value={selectedOption}
            onChange={handleOptionChange}
            placeholder={selectedOption}
            />
            {selectedOption && selectedOption.value !== 'AkikoBackend' &&(
              <div className='relative flex flex-col text-center'>
                <label htmlFor="inputValue" className='text-xl text-selected-text'>Endpoint URL or API Key:</label>
                <input
                id="inputValue"
                type="text"
                label="If using the Kobold or Ooba endpoint, enter the URL here. If using the OpenAI endpoint, enter your API key here. If using Horde, enter your API key or leave empty for anonymous mode."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={getDefaultInputValue(selectedOption.value)}
                />
              </div>
            )}
            {selectedOption && (
                <button className="connect-button" type="submit">Connect</button>
            )}
            </form>
            <Connect/>
            {selectedOption && selectedOption.value === 'Horde' && (
            <HordeModelSelector/>
            )}
          </div >
        </div>
      </div>
    );
  };
  
  export default ConnectMenu;
  