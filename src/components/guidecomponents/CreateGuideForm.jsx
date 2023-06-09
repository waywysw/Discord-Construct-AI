import React, { useState, useEffect, useRef } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { FiSave } from 'react-icons/fi';

const GuideForm = ({onClose}) => {
    const [guideName, setGuideName] = useState('');
    const [guideDescription, setGuideDescription] = useState('');
    const [guideContent, setGuideContent] = useState('');

    useEffect(() => {
        const closeOnEscapeKey = e => e.key === "Escape" ? onClose() : null;
        document.body.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(guideName, guideDescription, guideContent);
    }

    return (
        <>
        <div className="modal-overlay">
            <div className="relative bg-selected w-4/5 text-selected-text rounded shadow-lg backdrop-blur-10 focus-within:opacity-100 focus-within:button-container:flex justify-center">
                <span className="absolute top-0 right-0 m-2 cursor-pointer" onClick={() => onClose(false)}>&times;</span>
                <h1 className="text-xl font-bold">Guide Form</h1>
                <div className="flex flex-col w-full max-w-md p-4 bg-selected-color rounded-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="w-full items-center">
                            <label htmlFor="guideName">Guide Name</label>
                            <TextareaAutosize 
                            id="guideName"
                            className="character-field"
                            style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.411)' }}
                            onChange={(e) => setGuideName(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <label htmlFor="guideDescription">Guide Desciption</label>
                            <TextareaAutosize 
                            id="guideDescription"
                            className="character-field"
                            style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.411)' }}
                            onChange={(e) => setGuideDescription(e.target.value)}
                            />
                        </div>
                        <div className="w-full items-center">
                            <label htmlFor="guideContent">Guide Content</label>
                            <TextareaAutosize 
                            id="guideContent"
                            className="character-field"
                            style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.411)' }}
                            onChange={(e) => setGuideContent(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-none outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text">
                                <FiSave className="react-icon"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}
export default GuideForm;