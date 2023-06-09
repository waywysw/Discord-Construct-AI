import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import BackgroundSelector from "../BackgroundSelector";

function getLocalStorageColor(key, defaultColor) {
  const storedColor = localStorage.getItem(key);
  return storedColor ? JSON.parse(storedColor) : defaultColor;
}

function ColorPicker() {
  const [selectedElement, setSelectedElement] = useState("backdrop");

  const [backdropColor, setBackdropColor] = useState(() =>
    getLocalStorageColor("backdropColor", { r: 255, g: 255, b: 255, a: 1 })
  );
  const [buttonBoxColor, setButtonBoxColor] = useState(() =>
    getLocalStorageColor("buttonBoxColor", { r: 255, g: 255, b: 255, a: 1 })
  );
  const [textIconColor, setTextIconColor] = useState(() =>
    getLocalStorageColor("textIconColor", { r: 255, g: 255, b: 255, a: 1 })
  );
  const [textItalicColor, setTextItalicColor] = useState(() =>
    getLocalStorageColor("textItalicColor", { r: 255, g: 255, b: 255, a: 1 })
  );

  const colorSetters = {
    backdrop: setBackdropColor,
    buttonBox: setButtonBoxColor,
    textIcon: setTextIconColor,
    textItalic: setTextItalicColor,
  };

  const colors = {
    backdrop: backdropColor,
    buttonBox: buttonBoxColor,
    textIcon: textIconColor,
    textItalic: textItalicColor,
  };

  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, [colors]);

  function handleColorChange(newColor) {
    const setColor = colorSetters[selectedElement];
    if (setColor) {
      setColor((prevColor) => {
        const newColors = { ...prevColor, ...newColor.rgb };
        const root = document.documentElement;
        const colorString = `rgba(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b}, ${newColor.rgb.a})`;

        switch (selectedElement) {
          case "backdrop":
            root.style.setProperty("--selected-color", colorString);
            break;
          case "buttonBox":
            root.style.setProperty("--selected-bb-color", colorString);
            break;
          case "textIcon":
            root.style.setProperty("--selected-text-color", colorString);
            break;
          case "textItalic":
            root.style.setProperty("--selected-italic-color", colorString);
            break;
          default:
            break;
        }
        return newColors;
      });
    }
  }

  function handleElementChange(event) {
    setSelectedElement(event.target.value);
  }

  function clearBackgroundColor() {
    setBackgroundColor({ r: 255, g: 255, b: 255, a: 1, url: "" });
    const root = document.documentElement;
    root.style.setProperty("--selected-background-color", `rgba(255, 255, 255, 1)`);
    root.style.setProperty("--selected-background", 'url("https://i.imgur.com/jf9w6NO.png")');
  }

  // ... return statement and other code remain unchanged
  return (
    <div className="centered settings-box">
      <div className="mb-4">
        <h1 className='text-xl font-bold mb-2'>Custom UI Options</h1>
      </div>
      <div className="flex flex-col items-center text-center">
        <h3>Element to Change:</h3>
        <select value={selectedElement} onChange={handleElementChange} className="character-field">
          <option value="backdrop">Central UI Backdrop</option>
          <option value="buttonBox">Buttons/Boxes</option>
          <option value="textIcon">Normal Text/Icons</option>
          <option value="textItalic">Italic Text</option>
        </select>
        <h3>Selected Color:</h3>
        <ChromePicker
          color={colors[selectedElement]}
          onChange={handleColorChange}
        />
        <button className="connect-button" onClick={clearBackgroundColor}>
          Clear Background Color
        </button>
        <BackgroundSelector/>
      </div>
    </div>
  );
  
}

export default ColorPicker;
