import React, {useEffect, useState} from "react";
import { saveDiscordConfig, getDiscordSettings, createPreset, fetchPresets } from "./discordbot/dbotapi";
import { FiRefreshCcw, FiSave } from 'react-icons/fi';

const GenSettingsMenu = () => {
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
    const [samplerOrder, setSamplerOrder] = useState([
        6,
        3,
        2,
        5,
        0,
        1,
        4
      ],);
    const [presetName, setPresetName] = useState('');
    const [presets, setPresets] = useState([]);
  
    useEffect(() => {
        const getPresets = async () => {
            try {
                const response = await fetchPresets();
                setPresets(response.data.presets);
            } catch (error) {
                console.error(error);
            }
        }
        getPresets();
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
        } else if (endpoint === 'P-OAI') {
            setEndpointType(endpoint);
            setInvalidEndpoint(false);
        } else if (endpoint === 'P-Claude') {
            setEndpointType(endpoint);
            setInvalidEndpoint(false);
        } else {
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
                console.log(parsedSettings);
                setMaxContextLength(parsedSettings.max_context_length);
                setMaxLength(parsedSettings.max_length);
                setMinLength(parsedSettings.min_length);
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
                setSamplerOrder(parsedSettings.sampler_order);
            }
        } else if(endpointType === 'OAI' || endpointType === 'P-OAI' || endpointType === 'P-Claude'){
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
                setSamplerOrder(parsedSettings.sampler_order);
            }
        
        }else{
            console.log('Endpoint type not recognized. Please check your settings.')
            setInvalidEndpoint(true);
        }
    }, []);

    const savePreset = async () => {
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
            typical: parseFloat(typical),
            sampler_order: samplerOrder,
        };
        const data = {
            name: presetName,
            settings: settings
        };
        try {
            const response = await createPreset(data);
            console.log(response.data.message);
            setPresets(prevPresets => [...prevPresets, presetName]);
        } catch (error) {
            console.error(error);
        }
        let discord = await getDiscordSettings();
        discord.data.settings = settings;
        await saveDiscordConfig(discord.data);
    };

    const loadPreset = async (presetName) => {
        const preset = presets.find(p => p.name === presetName);
        if (preset) {
            const parsedSettings = preset.settings;
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
            setSamplerOrder(parsedSettings.sampler_order);
            setPresetName(presetName);
            let discord = await getDiscordSettings();
            discord.data.settings = settings;
            await saveDiscordConfig(discord.data);
        } else {
            console.error(`Preset with name ${presetName} not found`);
        }
    };

    const saveSettings = async () => {
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
            typical: parseFloat(typical),
            sampler_order: samplerOrder,
        };
        localStorage.setItem('generationSettings', JSON.stringify(settings));
        let discord = await getDiscordSettings();
        discord.data.settings = settings;
        await saveDiscordConfig(discord.data);
    };

    return (
        <div className="">
          {invalidEndpoint ? (
            <div className="relative flex flex-col justify-center text-white">
              <h1 className="mb-4 text-2xl">Invalid Endpoint</h1>
              <p className="mb-4 text-center">
                Please check your TextGen Endpoint and try again.
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center text-white">
                <div className="w-full">
                    <div className="grid grid-cols-4 gap-4">
                        <span className="col-span-1 font-bold">Preset Name</span>
                        <input className="col-span-2" type="text" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
                        <button className="aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-12 h-12 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text" onClick={(event) => savePreset()}>
                            <FiSave className="react-icon"/>
                        </button>
                    </div>
                    <select onChange={(e) => loadPreset(e.target.value)} className="justify-center bg-selected text-selected-text rounded shadow-lg border-2 border-solid border-gray-500">
                        {presets.map(preset => (
                            <option key={preset.name} value={preset.name}>{preset.name}</option>
                        ))}
                    </select>
            {(endpointType === "OAI" || endpointType === 'P-OAI' || endpointType === 'P-Claude') ? (
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
                        <div className="grid grid-cols-3 gap-4">
                            <span className="col-span-1 font-bold">Temperature</span>
                            <input className="col-span-1" type="range" min='0' max='10' step='0.01' value={temperature} onChange={(e) => {setTemperature(e.target.value); saveSettings();}} />
                            <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='10' step='0.01' value={temperature} onChange={(e) => {setTemperature(e.target.value); saveSettings();}} />
                        </div>
                    </>
          ) : (
            <>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Max Context Length</span>
                        <input className="col-span-1" type="range" min='512'max='9999999'value={maxContextLength} onChange={(e) => {setMaxContextLength(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='512' max='9999999' value={maxContextLength} onChange={(e) => {setMaxContextLength(e.target.value); saveSettings();}} />
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
                        <input className="col-span-1" type="range" min='0' max='4096' value={repPenRange} onChange={(e) => {setRepPenRange(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='4096' value={repPenRange} onChange={(e) => {setRepPenRange(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Repitition Pen Slope</span>
                        <input className="col-span-1" type="range" min='0' step='0.01' value={repPenSlope} onChange={(e) => {setRepPenSlope(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' step='0.01' value={repPenSlope} onChange={(e) => {setRepPenSlope(e.target.value); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Sampler Full Det.</span>
                        <input className="col-span-1" type="checkbox" checked={samplerFullDeterminism} onChange={(e) => {setSamplerFullDeterminism(e.target.checked); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Single Line Output</span>
                        <input className="col-span-1" type="checkbox" checked={singleline} onChange={(e) => {setSingleline(e.target.checked); saveSettings();}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Temperature</span>
                        <input className="col-span-1" type="range" min='0' max='10' step='0.01' value={temperature} onChange={(e) => {setTemperature(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='10' step='0.01' value={temperature} onChange={(e) => {setTemperature(e.target.value); saveSettings();}} />
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
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">TFS</span>
                        <input className="col-span-1" type="range" min='0' max='1' step='0.01' value={tfs} onChange={(e) => {setTfs(e.target.value); saveSettings();}} />
                        <input className="col-span-1 character-field" id='input-container' type="number" min='0' max='1' step='0.01' value={tfs} onChange={(e) => {setTfs(e.target.value); saveSettings();}} />
                    </div>
                    <div>
                        <span><i>The order by which all 7 samplers are applied, separated by commas. 0=top_k, 1=top_a, 2=top_p, 3=tfs, 4=typ, 5=temp, 6=rep_pen</i></span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="col-span-1 font-bold">Sampler Order</span>
                        <input className="col-span-2" type="text" value={samplerOrder} onChange={(e) => {setSamplerOrder(e.target.value.split(',').map(Number)); saveSettings();}} />
                    </div>
                    </>
          )}
            <button className="aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-gray-500 outline-none justify-center cursor-pointer transition-colors hover:bg-blue-600 text-selected-text" onClick={(event) => saveSettings()}>
                <FiSave className="react-icon"/>
            </button>
        </div>
      </div>
    )}
  </div>
);
};
export default GenSettingsMenu;
