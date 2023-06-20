import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getDiscordSettings, saveDiscordConfig } from '../discordbot/dbotapi';

const HordeModelSelector = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('https://aihorde.net/api/v2/status/models?type=text');
      const data = await response.json();
      const formattedData = data.map((model) => ({
        value: model.name,
        label: model.name,
      }));
      setModels(formattedData);
      // Set the default selected model if there are models
      if (formattedData.length > 0) {
        setSelectedModel(formattedData[0]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleChange = async (selectedOption) => {
    setSelectedModel(selectedOption);
    localStorage.setItem('hordeModel', selectedOption.value);
    let discord = await getDiscordSettings();
    discord.data.hordeModel = selectedOption.value
    await saveDiscordConfig(discord.data);
  };

  return (
    <>
    <h3 style={{'color': 'var(--selected-text-color)'}}>Horde Model Selector</h3>
      <Select
        id="options"
        inputId="model-select"
        value={selectedModel}
        onChange={handleChange}
        options={models}
      />
    </>
  );
};

export default HordeModelSelector;