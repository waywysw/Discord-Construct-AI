import axios from 'axios';
import { AUDIO_LOCATION, CURRENT_URL, API_URL, JS_API } from '../api';

export async function getBotStatus(){
    const response = await axios.get(`${JS_API}/discord-bot/status`);
    return response.data;
}
export async function startDisBot(){
    const response = await axios.get(`${JS_API}/discord-bot/start`);
    return response;
}
export async function stopDisBot(){
    const response = await axios.get(`${JS_API}/discord-bot/stop`);
    return response;
}
export async function getDiscordSettings(){
    const response = await axios.get(`${JS_API}/discord-bot/config`);
    return response.data;
}
export async function saveDiscordConfig(data){
    const response = await axios.post(`${JS_API}/discord-bot/config`, data);
    return response;
}
export async function getAvailableChannels(){
    const response = await axios.get(`${JS_API}/discord-bot/guilds`);
    return response;
}
export async function updateDiscordBot(){
    axios.get(`${JS_API}/discord-bot/update`);
}
export async function getBotInvite(appId){
    return `https://discord.com/oauth2/authorize?client_id=${appId}&scope=bot&permissions=1099511627775`
}
export async function createPreset(data){
    const response = await axios.post(`${JS_API}/text/preset`, data);
    return response;
}

export async function fetchPresets(){
    const response = await axios.get(`${JS_API}/text/preset`);
    return response.data.presets;
}
