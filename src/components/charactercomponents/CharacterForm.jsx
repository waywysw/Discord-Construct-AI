import React, { useState, useEffect } from "react";
import { FiSave, FiImage } from 'react-icons/fi';
import { BsFiletypeJson, BsFiletypePng } from "react-icons/bs";
import { exportJSON, exportNewCharacter } from '../api';
import { getTokenCount } from "../miscfunctions";

export const CharacterForm = ({ onCharacterSubmit, onClose }) => {
  const [characterName, setCharacterName] = useState('');
  const [nameTokenCount, setNameTokenCount] = useState(0);
  const [characterPersonality, setcharacterPersonality] = useState('');
  const [personalityTokenCount, setPersonalityTokenCount] = useState(0);
  const [characterDescription, setCharacterDescription] = useState('');
  const [descriptionTokenCount, setDescriptionTokenCount] = useState(0);
  const [characterScenario, setCharacterScenario] = useState('');
  const [scenarioTokenCount, setScenarioTokenCount] = useState(0);
  const [characterGreeting, setCharacterGreeting] = useState('');
  const [greetingTokenCount, setGreetingTokenCount] = useState(0);
  const [characterExamples, setCharacterExamples] = useState('');
  const [examplesTokenCount, setExamplesTokenCount] = useState(0);
  const [totalTokenCount, setTotalTokenCount] = useState(0);
  const [characterAvatar, setCharacterAvatar] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const closeOnEscapeKey = e => e.key === "Escape" ? onClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
        document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);
  
  useEffect(() => {
    if(characterName.length < 1) return;
    setNameTokenCount(getTokenCount(characterName));
  }, [characterName]);

  useEffect(() => {
    if(characterPersonality.length < 1) return;
    setPersonalityTokenCount(getTokenCount(characterPersonality));
  }, [characterPersonality]);

  useEffect(() => {
    if(characterDescription.length < 1) return;
    setDescriptionTokenCount(getTokenCount(characterDescription));
  }, [characterDescription]);

  useEffect(() => {
    if(characterScenario.length < 1) return;
    setScenarioTokenCount(getTokenCount(characterScenario));
  }, [characterScenario]);

  useEffect(() => {
    if(characterGreeting.length < 1) return;
    setGreetingTokenCount(getTokenCount(characterGreeting));
  }, [characterGreeting]);

  useEffect(() => {
    if(characterExamples.length < 1) return;
    setExamplesTokenCount(getTokenCount(characterExamples));
  }, [characterExamples]);

  useEffect(() => {
    setTotalTokenCount(nameTokenCount + personalityTokenCount + descriptionTokenCount + scenarioTokenCount + greetingTokenCount + examplesTokenCount);
  }, [nameTokenCount, personalityTokenCount, descriptionTokenCount, scenarioTokenCount, greetingTokenCount, examplesTokenCount]);

  async function handleSubmit(event) {
    event.preventDefault();
  
    // Check for characterAvatar and call getDefaultImage() if necessary
  
    const newCharacter = {
      char_id: Date.now(),
      name: characterName || "Default Name",
      personality: characterPersonality || "",
      description: characterDescription || "",
      scenario: characterScenario || "",
      first_mes: characterGreeting || "",
      mes_example: characterExamples || "",
      avatar: characterAvatar,
    };
  
    onCharacterSubmit(newCharacter);
  
    // Reset form input values
    setCharacterName('');
    setCharacterDescription('');
    setcharacterPersonality('');
    setCharacterScenario('');
    setCharacterGreeting('');
    setCharacterExamples('');
    setCharacterAvatar(null);
    setImageUrl(null);
    onClose();
  }
  

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCharacterAvatar(file);
      setImageUrl(imageUrl);
    } else {
      setCharacterAvatar(null);
      setImageUrl(null);
    }
  }

  const handleDownload = () => {
    const newCharacter = {
      char_id: Date.now(),
      name: characterName || "Default Name",
      personality: characterPersonality || "",
      description: characterDescription || "",
      scenario: characterScenario || "",
      first_mes: characterGreeting || "",
      mes_example: characterExamples || "",
      avatar: characterAvatar,
    };
    exportNewCharacter(newCharacter);
  };

  const handleJSONDownload = () => {
    const newCharacter = {
      char_id: Date.now(),
      name: characterName || "Default Name",
      personality: characterPersonality || "",
      description: characterDescription || "",
      scenario: characterScenario || "",
      first_mes: characterGreeting || "",
      mes_example: characterExamples || "",
      avatar: characterAvatar,
    };
    exportJSON(newCharacter);
  };

  return (
    <div className="modal-overlay">
      <div className="character-form max-w-full gap-1 mx-auto rounded-lg shadow-md backdrop-blur-md p-5 lg:w-4/5 m-auto">
        <span className="close cursor-pointer" onClick={onClose}>&times;</span>
        <h1 className="text-center text-lg sm:text-2xl text-selected-text"><b>Create New Character</b></h1>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col lg:flex-row w-full gap-2.5 justify-start items-center mt-auto'>
            <div className="w-full gap-1 flex flex-col items-center justify-center mt-0">
              <label htmlFor="avatar-field" className="relative cursor-pointer flex-shrink-0">
                {!imageUrl && <FiImage id="avatar-default" className="text-selected-text h-32 w-32 sm:h-56 sm:w-56 flex items-center justify-center"/>} 
                {imageUrl && <img src={imageUrl} alt="avatar" id="character-avatar-form" className="text-selected-text flex-shrink-0 h-32 w-32 sm:h-56 sm:w-56 rounded-md overflow-hidden"/>}
                <input
                  id="avatar-field"
                  type="file"
                  name="characterAvatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
                />
              </label>
              <i>{`(${totalTokenCount} total tokens)`}</i>
            </div>
            <div className="w-full gap-1 flex flex-col justify-start mt-0">
              <label className="mb-2 text-xs sm:text-base text-selected-text"><b>Name:</b></label>
              <textarea
                className="character-field w-full h-12 p-1 sm:h-16 sm:p-2 rounded-md resize-none text-selected-text"
                value={characterName}
                onChange={(event) => setCharacterName(event.target.value)}
                required
              />
              <i>{`(${nameTokenCount} tokens)`}</i>
              <label className="mb-2 text-xs sm:text-base"><b>Summary:</b></label>
              <textarea
                className="character-field w-full h-12 p-1 sm:h-16 sm:p-2 rounded-md resize-none text-selected-text"
                value={characterPersonality}
                onChange={(event) => setcharacterPersonality(event.target.value)}
              />
              <i>{`(${personalityTokenCount} tokens)`}</i>
              <label className="mb-2 text-xs sm:text-base"><b>Scenario:</b></label>
              <textarea
                className="character-field w-full h-12 p-1 sm:h-16 sm:p-2 rounded-md resize-none text-selected-text"
                value={characterScenario}
                onChange={(event) => setCharacterScenario(event.target.value)}
              />
              <i>{`(${scenarioTokenCount} tokens)`}</i>
            </div>
            <div className="w-full gap-2 flex flex-col justify-start mt-auto">
              <label htmlFor="characterGreeting" className="mb-2 text-xs sm:text-base"><b>Greeting:</b></label>
              <textarea
                className="character-field w-full h-48 p-1 sm:h-96 sm:p-2 rounded-md resize-none text-selected-text"
                value={characterGreeting}
                onChange={(event) => setCharacterGreeting(event.target.value)}
              />
              <i>{`(${greetingTokenCount} tokens)`}</i>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2.5 w-full">
            <div className="character-form-bottom-box w-full justify-start">
              <label className="mb-2 text-xs sm:text-base"><b>Description:</b></label>
              <textarea
                className="character-field w-full h-48 p-1 sm:h-96 sm:p-2 rounded-md resize-none text-selected-text"
                value={characterDescription}
                type="text"
                onChange={(event) => setCharacterDescription(event.target.value)}
              />
              <i>{`(${descriptionTokenCount} tokens)`}</i>
            </div>
            <div className="character-form-bottom-box w-full justify-start">
              <label className="mb-2 text-xs sm:text-base"><b>Dialogue Examples:</b></label>
              <textarea
                className="character-field w-full h-48 p-1 sm:h-96 sm:p-2 rounded-md resize-none text-selected-text"
                value={characterExamples}
                type="text"
                onChange={(event) => setCharacterExamples(event.target.value)}
              />
              <i>{`(${examplesTokenCount} tokens)`}</i>
            </div>
          </div>
          <div className="flex justify-center mt-4 mt-0"> 
            <button className="aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text" type="submit">
              <FiSave className="react-icon"/>
            </button>
            <button className="text-selected-text aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600" alt="Download Character as PNG" onClick={handleDownload}>
              <BsFiletypePng className="react-icon"/>
            </button>
            <button className="text-selected-text aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600" alt="Download Character as JSON" onClick={handleJSONDownload}>
              <BsFiletypeJson className="react-icon"/>
            </button>
          </div>
      </form>
    </div>
  </div>
  );
};

export default CharacterForm;