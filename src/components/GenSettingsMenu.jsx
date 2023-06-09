import React, {useEffect, useState} from "react";

const GenSettingsMenu = ({onClose}) => {
    const [endpointType, setEndpointType] = useState('');
    const [invalidEndpoint, setInvalidEndpoint] = useState(false);
    const [maxContextLength, setMaxContextLength] = useState(2048);
    const [maxLength, setMaxLength] = useState(180);
    const [repPen, setRepPen] = useState(1.1);
    const [repPenRange, setRepPenRange] = useState(1024);
    const [repPenSlope, setRepPenSlope] = useState(0.9);
    const [samplerFullDeterminism, setSamplerFullDeterminism] = useState(false);
    const [singleline, setSingleline] = useState(false);
    const [temperature, setTemperature] = useState(0.71);
    const [tfs, setTfs] = useState(1);
    const [topA, setTopA] = useState(0);
    const [topK, setTopK] = useState(40);
    const [topP, setTopP] = useState(0.9);
    const [typical, setTypical] = useState(1);
    const [minLength, setMinLength] = useState(10);
    
    useEffect(() => {
        const closeOnEscapeKey = e => e.key === "Escape" ? onClose() : null;
        const closeOnOutsideClick = e => {
          if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
          }
        };
        document.body.addEventListener("keydown", closeOnEscapeKey);
        window.addEventListener("mousedown", closeOnOutsideClick);
      
        return () => {
          document.body.removeEventListener("keydown", closeOnEscapeKey);
          window.removeEventListener("mousedown", closeOnOutsideClick);
        };
    }, []);  

    useEffect(() => {
        var endpoint = localStorage.getItem('endpointType');
        if(endpoint === 'AkikoBackend'){
            setEndpointType(endpoint);
            setInvalidEndpoint(false);
        } else if(endpoint === 'Kobold'){
            setEndpointType(endpoint);
            setInvalidEndpoint(false);
        } else if(endpoint === 'Ooba'){
            setEndpointType(endpoint);
            setInvalidEndpoint(false);
        } else if(endpoint === 'OAI'){
            setEndpointType(endpoint);
            setInvalidEndpoint(false);
        }else {
            console.log('Endpoint type not recognized. Please check your settings.')
            setInvalidEndpoint(true);
        }
    }, []);

    useEffect(() => {
        const endpointType = localStorage.getItem('endpointType');
        const settings = localStorage.getItem('generationSettings');
        if (endpointType === 'Kobold' || endpointType === 'Horde') {
            setInvalidEndpoint(false);
            if (settings) {
                const parsedSettings = JSON.parse(settings);
                setMaxContextLength(parsedSettings.max_context_length);
                setMaxLength(parsedSettings.max_length);
                setRepPen(parsedSettings.rep_pen);
                setRepPenRange(parsedSettings.rep_pen_range);
                setRepPenSlope(parsedSettings.rep_pen_slope);
                setSamplerFullDeterminism(parsedSettings.sampler_full_determinism);
                setSingleline(parsedSettings.singleline);
                setTemperature(parsedSettings.temperature);
                setTfs(parsedSettings.tfs);
                setTopA(parsedSettings.top_a);
                setTopK(parsedSettings.top_k);
                setTopP(parsedSettings.top_p);
                setTypical(parsedSettings.typical);
            }
        } else if(endpointType === 'OAI'){
            setInvalidEndpoint(false);
            if (settings) {
                const parsedSettings = JSON.parse(settings);
                setMaxLength(parsedSettings.max_length);
                setTemperature(parsedSettings.temperature);
            }
        }else if(endpointType === 'Ooba'){
            setInvalidEndpoint(false);
            if (settings) {
                const parsedSettings = JSON.parse(settings);
                setMaxContextLength(parsedSettings.max_context_length);
                setMaxLength(parsedSettings.max_length);
                setRepPen(parsedSettings.rep_pen);
                setMinLength(parsedSettings.min_length);
                setRepPenRange(parsedSettings.rep_pen_range);
                setRepPenSlope(parsedSettings.rep_pen_slope);
                setSamplerFullDeterminism(parsedSettings.sampler_full_determinism);
                setSingleline(parsedSettings.singleline);
                setTemperature(parsedSettings.temperature);
                setTfs(parsedSettings.tfs);
                setTopA(parsedSettings.top_a);
                setTopK(parsedSettings.top_k);
                setTopP(parsedSettings.top_p);
                setTypical(parsedSettings.typical);
            }
        
        }else{
            console.log('Endpoint type not recognized. Please check your settings.')
            setInvalidEndpoint(true);
        }
    }, []);

    const saveSettings = () => {
        const settings = {
            max_context_length: parseInt(maxContextLength),
            max_length: parseInt(maxLength),
            rep_pen: parseFloat(repPen),
            rep_pen_range: parseInt(repPenRange),
            rep_pen_slope: parseFloat(repPenSlope),
            sampler_full_determinism: samplerFullDeterminism,
            singleline: singleline,
            temperature: parseFloat(temperature),
            tfs: parseFloat(tfs),
            top_a: parseFloat(topA),
            top_k: parseInt(topK),
            top_p: parseFloat(topP),
            typical: parseFloat(typical)
        };
        localStorage.setItem('generationSettings', JSON.stringify(settings));
    };

    const onCloseInvalid = () => {
        saveSettings();
        setInvalidEndpoint(false);
        onClose();
    }


    return (
        <div className="modal-overlay flex items-center justify-center">
          {invalidEndpoint ? (
            <div className="relative inset-0 flex flex-col items-center justify-center p-8 bg-selected text-black rounded shadow-lg z-50 w-3/4 md:w-1/2 border-1 border-solid border-gray-500">
              <span
                className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-600"
                onClick={onClose}
              >
                &times;
              </span>
              <h1 className="mb-4 text-2xl">Invalid Endpoint</h1>
              <p className="mb-4 text-center">
                Please check your TextGen Endpoint and try again.
              </p>
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 focus:outline-none border-1 border-solid border-gray-500"
                onClick={() => onCloseInvalid()}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center p-8 bg-selected text-white rounded shadow-lg z-50 w-3/4 md:w-1/2 border-1 border-solid border-gray-500">
              <span
                className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-600"
                onClick={onClose}
              >
                &times;
              </span>
              <h1 className="mb-4 text-2xl">Generation Settings</h1>
              <div className="w-full">
                {endpointType === "OAI" ? (

                    <>
                        <div className="grid grid-cols-3 gap-4">
                            <span className="col-span-1 font-bold">Max Generation Length</span>
                            <input className="col-span-1" type="range" min='1' max='512' value={maxLength} onChange={(e) => {setMaxLength(e.target.value); saveSettings();}} />
                            <input className="col-span-1 character-field" id='character-field' type="number" min='1' max='512' value={maxLength} onChange={(e) => {setMaxLength(e.target.value); saveSettings();}} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <span className="col-span-1 font-bold">Min Generation Length</span>
                            <input className="col-span-1" type="range" min='1' max='512' value={minLength} onChange={(e) => {setMinLength(e.target.value); saveSettings();}} />
                            <input className="col-span-1 character-field" type="number" min='1' max='512' value={minLength} onChange={(e) => {setMinLength(e.target.value); saveSettings();}} />
                        </div>
                    </>
          ) : (
            <>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Max Context Length</span>
                        <input className="col-span-1" type="range" min='512' max='2048' value={maxContextLength} onChange={(e) => {setMaxContextLength(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='512' max='2048' value={maxContextLength} onChange={(e) => {setMaxContextLength(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Max Generation Length</span>
                        <input className="col-span-1" type="range" min='1' max='512' value={maxLength} onChange={(e) => {setMaxLength(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='1' max='512' value={maxLength} onChange={(e) => {setMaxLength(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Min Generation Length</span>
                        <input className="col-span-1" type="range" min='1' max='512' value={minLength} onChange={(e) => {setMinLength(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='1' max='512' value={minLength} onChange={(e) => {setMinLength(e.target.value); saveSettings();}} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Repitition Penalty</span>    
                        <input className="col-span-1" type="range" min='1' value={repPen} onChange={(e) => {setRepPen(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" value={repPen} onChange={(e) => {setRepPen(e.target.value); saveSettings();}} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Repitition Pen Range</span>
                        <input className="col-span-1" type="range" min='0' max='512' value={repPenRange} onChange={(e) => {setRepetitionPenaltyRange(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='512' value={repPenRange} onChange={(e) => {setRepetitionPenaltyRange(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Repitition Pen Slope</span>
                        <input className="col-span-1" type="range" min='0' max='1' step='0.01' value={repPenSlope} onChange={(e) => {setRepetitionPenaltySlope(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='1' step='0.01' value={repPenSlope} onChange={(e) => {setRepetitionPenaltySlope(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Sampler Full Det.</span>
                        <input className="col-span-1" type="checkbox" checked={samplerFullDeterminism} onChange={(e) => {setSamplerFullDeterminism(e.target.checked); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="text" value={samplerFullDeterminism} disabled />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Single Line Output</span>
                        <input className="col-span-1" type="checkbox" checked={singleline} onChange={(e) => {setSingleline(e.target.checked); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="text" value={singleline} disabled />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Temperature</span>
                        <input className="col-span-1" type="range" min='0' max='1' step='0.01' value={temperature} onChange={(e) => {setTemperature(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='1' step='0.01' value={temperature} onChange={(e) => {setTemperature(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Top A</span>
                        <input className="col-span-1" type="range" min='0' max='1' step='0.01' value={topA} onChange={(e) => {setTopA(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='1' step='0.01' value={topA} onChange={(e) => {setTopA(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Top K</span>
                        <input className="col-span-1" type="range" min='0' max='512' value={topK} onChange={(e) => {setTopK(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='512' value={topK} onChange={(e) => {setTopK(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Top P</span>
                        <input className="col-span-1" type="range" min='0' max='1' step='0.01' value={topP} onChange={(e) => {setTopP(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='1' step='0.01' value={topP} onChange={(e) => {setTopP(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Typical</span>
                        <input className="col-span-1" type="range" min='0' max='1' step='0.01' value={typical} onChange={(e) => {setTypical(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='1' step='0.01' value={typical} onChange={(e) => {setTypical(e.target.value); saveSettings();}} />
                    </div>
                    </>
          )}
        </div>
      </div>
    )}
  </div>
);
                        





}
export default GenSettingsMenu;
