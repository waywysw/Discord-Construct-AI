import React, { useState, useEffect } from "react";
import { fetchCharacter, getCharacterImageUrl, imageExists } from "../api";
import { FiSave } from "react-icons/fi";
import { updateDiscordBot } from "../discordbot/dbotapi";

const CurrentCharacter = ({ Character }) => {
    const [character, setCharacter] = useState({});
    const [imageUrl, setImageUrl] = useState(null);

useEffect(() => {
    async function fetchImageUrl() {
    const url = getCharacterImageUrl(character.avatar);
    const exists = await imageExists(url);
    if (exists) {
        setImageUrl(url);
    } else {
        setImageUrl(getCharacterImageUrl('default.png'));
    }
    }

    fetchImageUrl();
}, [character]);

useEffect(() => {
    fetchCharacter(Character).then((data) => {
    setCharacter(data);
    });
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
        </div>
      )}
    </>
);  
};

export default CurrentCharacter;