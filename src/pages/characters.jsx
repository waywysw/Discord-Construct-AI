import React, { useState, useEffect } from "react";
import { fetchCharacters, getCharacterImageUrl, deleteCharacter, createCharacter, updateCharacter, uploadTavernCharacter } from "../components/api";
import { CharacterForm } from "../components/charactercomponents/CharacterForm";
import { UpdateCharacterForm } from "../components/charactercomponents/UpdateCharacterForm";
import { InformationCircleIcon, TrashIcon, PlusCircleIcon, ArrowPathIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import CharacterInfoBox from "../components/charactercomponents/CharacterInfoBox";
import { FiShuffle } from "react-icons/fi";
import 'tailwindcss/tailwind.css';
import { getBotStatus, getDiscordSettings, updateDiscordBot, saveDiscordConfig } from "../components/discordbot/dbotapi";

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [characters, setCharacters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 12;

  // Calculate the total number of pages
  
  const filteredCharacters = characters ? characters.filter((character) => {
    return Object.values(character).some((value) =>
      value && 
      value
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }) : [];

  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  // Get the characters for the current page
  const getCurrentPageCharacters = () => {
    const startIndex = (currentPage - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    return filteredCharacters.slice(startIndex, endIndex);
  };

  // Update the current page when the user clicks a page number button
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleImageUpload = async (files) => {
    const filesArray = Array.from(files);
  
    const uploadPromises = filesArray.map(async (file) => {
      try {
        const importData = await uploadTavernCharacter(file);
        return importData;
      } catch (error) {
        console.error(error);
      }
    });
  
    try {
      const importedDataArray = await Promise.all(uploadPromises);
      const uniqueCharacters = importedDataArray.filter(
        (character, index, self) =>
          index ===
          self.findIndex(
            (char) => char.name === character.name && char.name !== undefined
          )
      );
  
      setCharacters((prevCharacters) => [
        ...prevCharacters,
        ...uniqueCharacters.filter((data) => data),
      ]);
    } catch (error) {
      console.error("Error processing multiple files:", error);
    }
  };
  
  
  
  const fetchAndSetCharacters = async () => {
    try {
      try {
        const storedCharacters = localStorage.getItem('characters');
        setCharacters(JSON.parse(storedCharacters));
      } catch {
        console.log("No characters in local storage.");
      }
      const data = await fetchCharacters();
      setCharacters(data);
      localStorage.setItem('characters', JSON.stringify(data));
    } catch (error) {
      console.error(error);
      if(localStorage.getItem('characters') === null) {
        console.log("No characters in local storage.");
      }else{
        console.log("Characters loaded from local storage.");
        const storedCharacters = localStorage.getItem('characters');
        setCharacters(JSON.parse(storedCharacters));
      }
    }
  };

  
  useEffect(() => {
    fetchAndSetCharacters();
  }, []);

  const selectCharacter = async (character) => {
    const charId = character.char_id;
    // Save char_id to localStorage
    localStorage.setItem("selectedCharacter", charId);
    const item = localStorage.getItem("selectedCharacter");
    let data = await getDiscordSettings();
    data.data.charId = charId;
    await saveDiscordConfig(data.data);
    if(await getBotStatus() === true){
      await updateDiscordBot();
    }
    if (item === null) {
      console.log("Character selection failed.");
    } else {
      console.log("Selected Character set to:", item);
    }
  };

  const openModal = (character) => {
    setSelectedCharacter(character);
  };

  const closeModal = () => {
    setSelectedCharacter(null);
  };
  
  function addCharacter(newCharacter) {
    createCharacter(newCharacter)
      .then(responseData => {
        setCharacters([...characters, {...responseData}]);
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  
  const editCharacter = (updatedCharacter) => {
    const updatedCharacters = characters.map((c) => c.char_id === updatedCharacter.char_id ? updatedCharacter : c);
    setCharacters(updatedCharacters);
  };

  const delCharacter = async (character) => {
    setCharacterToDelete(character);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCharacter(characterToDelete.char_id);
      const updatedCharacters = characters.filter((c) => c.char_id !== characterToDelete.char_id);
      setCharacters(updatedCharacters);
      setShowDeleteModal(false);
      setCharacterToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const refresh = async () => {
    try {
      fetchAndSetCharacters();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const pickRandomChar = async () => {
    try {
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      selectCharacter(randomChar);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex justify-center mb-6">
        <div className="grid grid-cols-6 gap-0">
          <button 
            style={{ color: 'var(--selected-text-color)',}}
            className="bg-selected aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600" onClick={refresh} title="Refresh Character List">
              <ArrowPathIcon className="hero-icon"/>
          </button>
          <button 
            style={{ color: 'var(--selected-text-color)',}}
            className="bg-selected aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600" onClick={() => setShowForm(true)} title="Create Character">
            <PlusCircleIcon className="hero-icon"/>
          </button>
          <label htmlFor="character-image-input"  
            style={{ color: 'var(--selected-text-color)', cursor: 'pointer',}}
            className="bg-selected aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600" title="Import Character Card">
            <ArrowUpTrayIcon className="hero-icon"/>
          </label>
          <button
            style={{ color: 'var(--selected-text-color)',}}
            className="bg-selected aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600" onClick={() => pickRandomChar()} title="Create Character">
            <FiShuffle className="react-icon"/>
          </button>
          <input
            type="file"
            accept="image/png, application/json"
            id="character-image-input"
            onChange={(e) => handleImageUpload(e.target.files)}
            style={{ display: 'none' }}
            multiple={true}
          />
          {characters && 
          <div className="chara-search-bar col-span-2">
            <input
              type="text"
              placeholder="Search characters"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          }
        </div>
      </div>
      <div className="w-full h-full grid place-content-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 mx-auto">
          {characters &&
            getCurrentPageCharacters().map((character) => (
              <CharacterInfoBox key={character.char_id} Character={character} openModal={openModal} delCharacter={delCharacter} selectCharacter={selectCharacter} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mt-6 mb-3">
        {characters && 
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`bg-selected aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 ${currentPage === index + 1 ? "bg-blue-600 text-selected-text" : "bg-selected-light text-selected"}`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))
          }
      </div>
      {showForm && (
        <CharacterForm
          onCharacterSubmit={addCharacter}
          onClose={() => setShowForm(false)}
        />
      )}
      {selectedCharacter && (
        <UpdateCharacterForm
              character={selectedCharacter}
              onUpdateCharacter={editCharacter}
              onClose={closeModal}
        />
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="relative flex flex-col items-center justify-center p-10 bg-selected text-selected-text rounded shadow-lg">
            <h1>Delete Character</h1>
            <p className="centered">Are you sure you want to delete {characterToDelete.name}?</p>
            <div className="flex justify-center gap-6">
              <button className="text-selected-text bg-selected h-full p-2 rounded-lg shadow-md backdrop-blur-md border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer hover:bg-blue-600" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="text-selected-text bg-selected h-full p-2 rounded-lg shadow-md backdrop-blur-md border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer hover:bg-red-600" onClick={() => handleDelete()}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Characters;
