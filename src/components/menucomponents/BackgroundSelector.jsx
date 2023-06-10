import React, { useState, useEffect, useRef } from "react";
import { deleteBackground, fetchBackgrounds, getBackgroundImageUrl, uploadBackground } from "../api";
import { FiImage, FiTrash2  } from "react-icons/fi";

const BackgroundSelector = ({ onBackgroundChange }) => {
  const root = document.documentElement;
  const [background, setBackground] = useState(null);
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("background") !== null) {
      setBackground(localStorage.getItem("background"));
    }
    const fetchAndSetBackgrounds = async () => {
      const data = await fetchBackgrounds();
      if (data !== null) {
        setBackgrounds(data);
      }
    };
    fetchAndSetBackgrounds();
  }, []);

  useEffect(() => {
    if (background !== null) {
      localStorage.setItem("background", background);
      console.log("Setting background to: " + background);
      root.style.setProperty(
        "--selected-background",
        `url(${getBackgroundImageUrl(background)})`
      );
    }
  }, [background]);

  const handleBackgroundChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const result = await uploadBackground(file);
      if (result && result.filename) {
        setBackground(result.filename);
        setBackgrounds([...backgrounds, result.filename]);
        onBackgroundChange(result.filename);
      } else {
        console.error("Failed to upload the custom background.");
      }
    }
  };   

  const handleBackgroundDelete = async (filename) => {
    const result = await deleteBackground(filename);
    if (result && result.success) {
      setBackgrounds(backgrounds.filter((bg) => bg !== filename));
      if (background === filename) {
        setBackground(null);
        onBackgroundChange(null);
      }
    } else {
      console.error("Failed to delete the background.");
    }
  };

  return (
    <div className="settings-box">
      <h2 className="text-xl font-bold mb-4 text-center mx-auto">Background Selector</h2>
      <div className="grid grid-cols-3 gap-4">
        {backgrounds.map((bg) => (
          <div key={bg} className="relative mt-2">
            <div
              onClick={() => setBackground(bg)}
              className={
                background === bg
                  ? "border-2 border-blue-500 rounded-md p-1"
                  : "border-2 border-transparent rounded-md p-1"
              }
            >
              <img
                src={getBackgroundImageUrl(bg)}
                alt="Background"
                width={150}
                height={150}
                className="rounded-md"
              />
            </div>
            <button
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md"
              onClick={(e) => {
                e.stopPropagation();
                handleBackgroundDelete(bg);
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        <div>
          <label htmlFor="backgroundSelector" className="relative">
            <FiImage className="w-20 h-20 text-selected-text text-center mx-auto cursor-pointer" />
            <input
              id="backgroundSelector"
              type="file"
              name="background"
              accept=".png,.jpg,.jpeg"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleBackgroundChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
export default BackgroundSelector;
