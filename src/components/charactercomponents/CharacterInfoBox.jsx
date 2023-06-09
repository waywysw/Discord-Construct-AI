import React, { useState, useEffect } from "react";
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getCharacterImageUrl, imageExists } from "../api";
import { FiCheck } from "react-icons/fi";
const CharacterInfoBox = ({ Character, openModal, delCharacter, selectCharacter }) => {
    const [character, setCharacter] = useState({});
    const [imageUrl, setImageUrl] = useState(null);

useEffect(() => {
    async function fetchImageUrl() {
    const url = getCharacterImageUrl(Character.avatar);
    const exists = await imageExists(url);
    if (exists) {
        setImageUrl(url);
    } else {
        setImageUrl(getCharacterImageUrl('default.png'));
    }
    }

    fetchImageUrl();
}, [Character]);

useEffect(() => {
    setCharacter(Character);
}, [Character]);

return (
    <>
      {character && (
        <div
          key={character.char_id}
          className="character-info-box relative rounded-lg bg-selected-bb-color shadow-md backdrop-blur-10 focus-within:opacity-100 focus-within:button-container:flex justify-center border-1 border-solid border-gray-500"
          tabIndex="0"
        >
          <h2 className="absolute w-auto px-2 py-1.5 text-xl sm:text-2xl md:text-3xl text-center text-selected-text-color z-2 top-2 sm:top-3 md:top-4 left-1/2 transform -translate-x-1/2">
            <b>{character.name}</b>
          </h2>
          <img
            src={imageUrl}
            title={character.name}
            id="character-avatar"
          />
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
            <div className="button-container w-48 h-16 sm:w-64 sm:h-20 md:w-48 md:h-16 flex justify-between">
              <button
                className="cancel text-selected-text bg-selected w-1/3 h-full p-2 rounded-lg shadow-md backdrop-blur-md border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer hover:bg-red-600"
                id="cancel"
                onClick={() => delCharacter(character)}
                title="Delete Character"
              >
                <TrashIcon />
              </button>
              <button
                className="text-selected-text bg-selected w-1/3 h-full p-2 rounded-lg shadow-md backdrop-blur-md border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer hover:bg-blue-600"
                id="select"
                onClick={() => selectCharacter(character)}
                title="Select Character"
              >
                <FiCheck className="react-icon" />
              </button>
              <button
                className="text-selected-text bg-selected w-1/3 h-full p-2 rounded-lg shadow-md backdrop-blur-md border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer hover:bg-blue-600"
                id="select"
                onClick={() => openModal(character)}
                title="View Character Details"
              >
                <InformationCircleIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
);  
};

export default CharacterInfoBox;