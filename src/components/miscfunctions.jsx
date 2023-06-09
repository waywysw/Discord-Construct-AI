import GPT3Tokenizer from 'gpt3-tokenizer';
import { getCharacterSpeech } from './api';

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });

export function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });
  }

export function getTokenCount(text){
  let tokenCount = 0;
  let encodedStr;
  try{
    encodedStr = tokenizer.encode(text);
    tokenCount = encodedStr.bpe.length;
  }catch(e){
    console.log(e);
  }
  return tokenCount;
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function emotion2SsmlStyle(emotion) {
  var style;
  if (emotion == null) {
      style = "General";
  } else {
      const emotionToEkman = {
          "neutral": ["neutral"],
          "anger": ["anger", "annoyance", "disapproval"],
          "disgust": ["disgust"],
          "fear": ["fear", "nervousness"],
          "joy": ["joy", "amusement", "approval", "excitement", "gratitude", "love", "optimism", "relief", "pride", "admiration", "desire", "caring"],
          "sadness": ["sadness", "disappointment", "embarrassment", "grief", "remorse"],
          "surprise": ["surprise", "realization", "confusion", "curiosity"]
      };
      for (let e in emotionToEkman) {
          if (emotionToEkman[e].includes(emotion)) {
              emotion = e;
          }
      }
      const emotionToSsmlStyleMap = {
          "neutral": "General",
          "anger": "Angry",
          "disgust": "Unfriendly",
          "fear": "Terrified",
          "joy": "Excited",
          "sadness": "Sad",
          "surprise": "Excited"
      };
      style = emotionToSsmlStyleMap[emotion]
  }
  return style;
}

/**
 * https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup
 * SSML stands for Speech Synthesis Markup Language. It is used with Azure's text to speech API to define
 * aspects about how you want the speech output to be like. For example, there are different voices (Jenny, Jane, John, etc).
 * You can use SSML to choose which voice. This helper method just formats certain variables into a proper SSML string.
 * @param {string} response What you want her to say
 * @param {string} style Voice style (see Azure demo) 
 * @returns 
 */
export async function createSsml(response, emotion, charId) {
  const currentCharacterSettings = await getCharacterSpeech(charId);
  if (currentCharacterSettings == null) {
      return null;
  }
  var name = currentCharacterSettings.azureTTSName;
  var prosodyRate = currentCharacterSettings.prosodyRate;
  var prosodyPitch = currentCharacterSettings.prosodyPitch;
  var style = emotion2SsmlStyle(emotion);
  var textToSpeak = replaceItalicizedTextWithPause(response);
  return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
                  <voice name="${name}">
                      <mstts:viseme type="FacialExpression"/>
                      <mstts:express-as style="${style}" >
                          <prosody rate="${prosodyRate}%" pitch="${prosodyPitch}%">
                              ${textToSpeak}
                          </prosody>
                      </mstts:express-as>
                  </voice>
              </speak>`;
}

function insertPauseInAsteriskEncapsulatedText(inputText, pauseDuration = "1.5s") {
  return inputText.replace(/\*(.*?)\*/g, `<break time="${pauseDuration}"/>$1<break time="${pauseDuration}"/>`);
}

function replaceItalicizedTextWithPause(inputText, pauseDuration = "1s") {
  return inputText.replace(/\*(.*?)\*/g, `<break time="${pauseDuration}"/>`);
}

export function separateWords(text) {
  return text.replace(/([A-Z])/g, ' $1').trim();
}

export function convertToReadableDateTime(inputString) {
  const regex = /(\D+)_+(\d+)/;
  const match = inputString.toString().match(regex);

  if (match) {
    const namePart = match[1];
    const timestamp = parseInt(match[2], 10);

    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);

      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      };

      return namePart + ' ' + date.toLocaleString(undefined, options);
    }
  }

  return inputString;
}

export function convertUnixTimestampToDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric"
  });
}