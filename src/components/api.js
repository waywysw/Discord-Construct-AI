import axios from 'axios';
export const CURRENT_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
export const API_URL = `${CURRENT_URL}/v1`;
export const JS_API = `${CURRENT_URL}/api`;
export const AVATARS_FOLDER = 'character_images';
export const EXPORTS_FOLDER = 'exports';
export const USER_AVATAR_FOLDER = 'user_avatars';
export const BACKGROUNDS_FOLDER = 'backgrounds';
export const AUDIO_LOCATION = 'audio'

export function downloadImage(imageUrl, fileName) {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function imageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error fetching image:', error);
    return false;
  }
}

export async function fetchCharacters() {
  const response = await axios.get(`${JS_API}/characters`);
  return response.data;
}

export async function fetchGuides() {
  const response = await axios.get(`${API_URL}/guides`);
  return response.data;
}

export async function fetchSettings() {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  } catch {
    console.log('No settings file found')
  }
}


export async function fetchCharacter(charId) {
  const response = await axios.get(`${JS_API}/characters/${charId}`);
  return response.data;
}

export async function fetchUserAvatars() {
  const response = await axios.get(`${JS_API}/user-avatar`);
  return response.data.avatars;
}

export async function fetchBackgrounds() {
  const response = await axios.get(`${JS_API}/backgrounds`);
  return response.data.backgrounds;
}

export async function saveUserAvatar(image) {
  const formData = new FormData();
  formData.append('avatar', image);
  const response = await axios.post(`${JS_API}/user-avatar`, formData);
  if(response.data.avatar !== undefined){
    return response.data.avatar;
  }
  else{
    return response.data;
  }
}

export async function sendCharacterSpeech(characterSpeech, char_id) {
  const response = await axios.post(`${JS_API}/character-speech/${char_id}`, characterSpeech);
  return response.data;
}

export async function getCharacterSpeech(charId) {
  return axios.get(`${JS_API}/character-speech/${charId}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error fetching character speech for ${charId}: ${error}`);
      return null;
    });
}

export async function createCharacter(newCharacter) {
  const formData = new FormData();
  formData.append('char_id', newCharacter.char_id);
  formData.append('name', newCharacter.name);
  formData.append('personality', newCharacter.personality);
  formData.append('description', newCharacter.description);
  formData.append('scenario', newCharacter.scenario);
  formData.append('first_mes', newCharacter.first_mes);
  formData.append('mes_example', newCharacter.mes_example);
  formData.append('avatar', newCharacter.avatar);

  const response = await axios.post(`${JS_API}/characters`, formData);

  return response.data;
}

export function getCharacterImageUrl(avatar) {
  return `${CURRENT_URL}/${AVATARS_FOLDER}/${avatar}`;
}
export function getUserImageUrl(avatar) {
  return `${CURRENT_URL}/${USER_AVATAR_FOLDER}/${avatar}`;
}
export function getBackgroundImageUrl(background) {
  return `${CURRENT_URL}/${BACKGROUNDS_FOLDER}/${background}`;
}

export const uploadBackground = async (file) => {
  const formData = new FormData();
  formData.append("background", file);

  try {
    const response = await axios.post(`${JS_API}/backgrounds`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.filename ? response.data : null; // Update this line
  } catch (error) {
    console.error("Error uploading background:", error);
    return null;
  }
};

export const deleteBackground = async (filename) => {
  try {
    const response = await axios.delete(`${JS_API}/backgrounds/${filename}`);
    return response.data.success ? response.data : null;
  } catch (error) {
    console.error(`Error deleting background: ${error}`);
    return null;
  }
};

export async function deleteCharacter(charId) {
  const response = await axios.delete(`${JS_API}/characters/${charId}`);
  return response.data;
}

export async function updateCharacter(updatedCharacter) {
  const formData = new FormData();
  formData.append('char_id', updatedCharacter.char_id);
  formData.append('name', updatedCharacter.name);
  formData.append('personality', updatedCharacter.personality);
  formData.append('description', updatedCharacter.description);
  formData.append('scenario', updatedCharacter.scenario);
  formData.append('first_mes', updatedCharacter.first_mes);
  formData.append('mes_example', updatedCharacter.mes_example);
  formData.append('avatar', updatedCharacter.avatar);

  const response = await axios.put(`${JS_API}/characters/${updatedCharacter.char_id}`, formData);

  return response.data;
}

export const saveConversation = async (convo) => {
  try {
    const response = await axios.post(`${JS_API}/conversation`, convo);
    if (response.data.status === 'success') {
      console.log('Conversation saved');
    } else {
      console.error('Error saving conversation');
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

export async function fetchConversations() {
  const response = await axios.get(`${JS_API}/conversations`);
  const allConversations = response.data.conversations;
  return allConversations;
}


export async function deleteConversation(conversationName) {
  const response = await axios.delete(`${JS_API}/conversation/${conversationName}`);
  return response.data;
}


export async function fetchConversation(conversationName) {
  const response = await axios.get(`${JS_API}/conversation/${conversationName}`);
  return response.data;
}


export async function uploadTavernCharacter(image){
  const formData = new FormData();
  formData.append('char_id', Date.now());
  formData.append('image', image);
  const response = await axios.post(`${JS_API}/tavern-character`, formData);
  return response.data;
}


export async function exportTavernCharacter(charId, charName) {
  await axios.get(`${JS_API}/tavern-character/${charId}`);
  var link = `/${EXPORTS_FOLDER}/${charId}.png`
  downloadImage(link, `${charName}.AkikoCharaCard.png`);
  return `/${EXPORTS_FOLDER}/${charName}.AkikoCharaCard.png`;
}

export async function exportNewCharacter(character) {
  const formData = new FormData();
  formData.append('char_id', character.char_id);
  formData.append('name', character.name);
  formData.append('personality', character.personality);
  formData.append('description', character.description);
  formData.append('scenario', character.scenario);
  formData.append('first_mes', character.first_mes);
  formData.append('mes_example', character.mes_example);
  formData.append('avatar', character.avatar);
  await axios.post(`${JS_API}/tavern-character/new-export`, formData);
  var link = `/${EXPORTS_FOLDER}/${character.name}.AkikoCharaCard.png`
  downloadImage(link, `${character.name}.AkikoCharaCard.png`);
  return `/${EXPORTS_FOLDER}/${character.name}.AkikoCharaCard.png`;
}

export async function exportJSON(character) {
  const response = await axios.post(`${JS_API}/tavern-character/json-export/${character.char_id}`, {
    responseType: 'blob',
  });
  
  const blob = new Blob([response.data], { type: 'application/json' });
  const fileName = `${character.name}.AkikoJSON.json`;

  downloadImage(URL.createObjectURL(blob), fileName);
}

export async function fetchAdvancedCharacterEmotion(character, emotion) {
  const response = await axios.get(`${JS_API}/advanced-character/${character.char_id}/${emotion}`);
  return response.data['path'];
}

export async function fetchAdvancedCharacterEmotions(character) {
  const response = await axios.get(`${JS_API}/advanced-character/${character.char_id}`);
  return response.data['emotions'];
}

export async function saveAdvancedCharacterEmotion(character, emotionName, emotionFile) {
  console.log(typeof emotionFile); // should be 'object'
  console.log(emotionFile); // should be a file object
  const formData = new FormData();
  formData.append('emotion', emotionFile);
  // create a config object for axios
  const config = {
    // remove the Content-Type header
    headers: { 'Content-Type': undefined }
    // or set it to multipart/form-data
    // headers: { 'Content-Type': 'multipart/form-data' }
  };
  const response = await axios.post(`${JS_API}/advanced-character/${character.char_id}/${emotionName}`, formData, config);
  return response.data['path'];
}


export async function deleteAdvancedCharacterEmotion(character, emotion) {
  const response = await axios.delete(`${JS_API}/advanced-character/${character.char_id}/${emotion}`);
  return response.data;
}

export async function updateAdvancedCharacter(advancedCharacter) {
  const formData = new FormData();
  formData.append('char_id', advancedCharacter.char_id);
  formData.append('name', advancedCharacter.name);

  const response = await axios.put(`${JS_API}/advanced-character/${advancedCharacter.char_id}`, formData);

  return response.data;
}

export async function getAvailableModules() {
  let modules = [];

  try {
    const response = await axios.get(`${API_URL}/modules`);
    modules = response.data['modules'];

    // Set localStorage values for caption and classify
    for (let i = 0; i < modules.length; i++) {
      switch (modules[i]) {
        case 'caption':
          localStorage.setItem('imageCaptioning', true);
          break;
        case 'classify':
          localStorage.setItem('useEmotionClassifier', 1);
          console.log('Emotion classifier found');
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error('Error fetching modules:', error);
    localStorage.setItem('useEmotionClassifier', 0);
    localStorage.setItem('imageCaptioning', false);
  }

  // Check if both caption and classify are present, otherwise set to false
  const hasCaption = modules.includes('caption');
  const hasClassify = modules.includes('classify');
  if (!hasCaption) {
    localStorage.setItem('imageCaptioning', false);
  }
  if (!hasClassify) {
    localStorage.setItem('useEmotionClassifier', 0);
  }

  return modules;
}
