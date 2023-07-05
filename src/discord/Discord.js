import { botReady, botSettings, disClient, generateText, getCharacter, CHARACTER_IMAGES_FOLDER, notesPath, aliasPath } from "../../server.js";
import GlobalState from "./GlobalState.js";
import { promisify } from 'util';
import { ActivityType } from 'discord.js';
import path from 'path';
import fs from 'fs-extra';

export async function doCharacterChat(message){
    let charId = botSettings.charId;
    let endpoint = botSettings.endpoint;
    let endpointType = botSettings.endpointType;
    let settings = botSettings.settings;
    let hordeModel = botSettings.hordeModel;
    let prompt = await getPrompt(charId, message);
    let character = await getCharacter(charId);
    let results;
    let username = await getUserName(message.channel.id, message.author.username);
    console.log("Generating text...")
    try{
      results = await generateText(prompt, username);
    } catch (error) {
      console.error('Error:', error);
      return;
    }
    results = results.results[0];
    let generatedText;
    if(endpointType === 'Kobold' || endpointType === 'Horde'){
      generatedText = results['text'];
    }else{
      generatedText = results;
    }
    let removeAble = `${character.name}:`;
    let response = parseTextEnd(generatedText)
    let text;
    if(GlobalState.bias.length > 0 && response[0] !== undefined){
      text = `${username}: ${message.cleanContent}\n${character.name}: ${GlobalState.bias} ${response[0].replace(/<user>/g, username).replace(removeAble, '')}\n`;
    }else if(response[0] !== undefined){
      text = `${username}: ${message.cleanContent}\n${character.name}: ${response[0].replace(/<user>/g, username).replace(removeAble, '')}\n`;
    }
    if(response[0] === undefined){
      console.log("Response is undefined");
      return;
    }
    await saveConversation(message, charId, text);
    if (Math.random() < 0.75) {
      // 75% chance to reply directly to the message
      message.reply(`${GlobalState.bias} ${response[0].replace(/<user>/g, username).replace(removeAble, '')}`);
    } else {
      // 25% chance to just send a message to the channel
      message.channel.send(`${GlobalState.bias} ${response[0].replace(/<user>/g, username).replace(removeAble, '')}`);
    };
    GlobalState.bias = '';
  };
  
  export async function saveConversation(message, charId, text){
    const logName = `${message.channel.id}-${charId}.log`;
    const pathName = path.join('./public/discord/logs/', logName);
  
    // Check if the directory exists, and if it doesn't, create it
    await fs.ensureDir(path.dirname(pathName));

    // Then append text to the file (it will create the file if it doesn't exist)
    await fs.appendFile(pathName, text);
  }

  export async function getStopList(message) {
    let usernames = [];
    
    // Fetch all members from the guild where the message was sent
    await message.guild.members.fetch().then(members => {
        members.each(member => {
            // Check if the member is not the author of the message
            if(!(message.author.id === member.user.id)) {
                // Format the username as per the request
                usernames.push(`${member.user.username}:`);
            }
        });
    }).catch(console.error);
    
    usernames.push('You:');
    
    return usernames;
  }
  
  export function removeLastLines(filename, numLinesToRemove) {
    const pathName = path.join('./public/discord/logs/', filename);
    // Read the file into a string
    let fileContent = fs.readFileSync(pathName, 'utf-8');
  
    // Split the string into lines
    let lines = fileContent.split('\n');
  
    // Check if the number of lines to remove is greater than the total number of lines
    if (numLinesToRemove >= lines.length) {
      // If it is, just clear the file
      fs.writeFileSync(filename, '', 'utf-8');
    } else {
      // Otherwise, remove the last x lines
      lines.splice(lines.length - numLinesToRemove, numLinesToRemove);
    
      // Join the lines back together and write back to the file
      let newFileContent = lines.join('\n');
      fs.writeFileSync(filename, newFileContent, 'utf-8');
    }
  }
  
  export async function getPrompt(charId, message, isSystem = false, systemMessage = null, isRegen = false){
    let channelID = message.channel.id;
    let history = await getHistory(charId, channelID, GlobalState.historyLines);
    let character = await getCharacter(charId);
    let currentMessage;
    let user;
    let convo = history;
    
    if(isSystem){
      user = await getUserName(channelID, message.user.username);
      currentMessage = `${systemMessage}`;
    }if(!isSystem){
      user = await getUserName(channelID, message.author.username);
      currentMessage = `${user}: ${message.cleanContent}`;
    }if(isRegen){
      convo = removeLastLine(convo);
    }else{
      if (!convo.includes(currentMessage)) {
        convo += `\n`+ currentMessage + '\n';
      }
    }
    let authorsNote = await fetchAuthorsNote(channelID, charId);
    
    let basePrompt = '';
    if(character.name.length > 1){
      basePrompt += character.name;
    }
    if(character.description.length > 1){
      basePrompt += ":\n" + character.description + '\n';
    }
    if(character.scenario.length > 1){
      basePrompt += 'Scenario:\n' + character.scenario + '\n';
    }
    if(character.mes_example.length > 1){
      basePrompt += 'Example Dialogue:\n' + character.mes_example + '\n';
    }
    let createdPrompt = basePrompt + convo + character.name + ':';
    
    if(GlobalState.bias.length > 0){
      createdPrompt += ' ' + GlobalState.bias;
    }
    if(!authorsNote.length === undefined){
      if(authorsNote.length > 0){
        console.log("Author's note: ", authorsNote);
        createdPrompt = insertAtLineFromEnd(createdPrompt, GlobalState.authorsNoteDepth, authorsNote);
      }
    }
    createdPrompt = cleanEmoji(createdPrompt);
    
    return createdPrompt.replace(/{{char}}/g, character.name).replace(/{{user}}/g, user).replace(/\r/g, '');
  };
  
  
  export function insertAtLineFromEnd(prompt, lineFromEnd, text) {
    // Split the string into lines
    let lines = prompt.split('\n');
  
    // Calculate the index where to insert the text
    let index = lines.length - lineFromEnd;
  
    // Insert the text at the calculated index
    lines.splice(index, 0, text);
  
    // Join the lines back together
    return lines.join('\n');
  }
  export function removeLastLine(history) {
    // Split the string into lines
    let lines = history.split('\n');
  
    // Remove the last line
    lines.pop();
  
    // Join the lines back together
    return lines.join('\n');
  }
  export function parseTextEnd(text) {
    return text.split("\n")
               .map(line => line.trim())
               .filter(line => line !== "");
  }
  
  export function cleanUsername(username) {
    // Remove leading characters
    let cleaned = username.replace(/^[._-]+/, '');
  
    // Remove trailing characters
    cleaned = cleaned.replace(/[._-]+$/, '');
  
    return cleaned;
  }
  // async function regenerateReply(){
  
  // };
  
  export function cleanEmoji(text) {
    // Remove emoji characters using regex
    return text.replace(/<:[a-zA-Z0-9_]+:[0-9]+>/g, '');
  }
  
  async function getHistory(charId, channel, lines = null) {
    let logName = `${channel}-${charId}.log`;
    let pathName = path.join('./public/discord/logs/', logName);
  
    if (fs.existsSync(pathName)) {
      try {
        const data = fs.readFileSync(pathName, 'utf8');
        const allLines = data.split('\n');
        if(lines === true){
          return allLines;
        }
        let startIndex = Math.max(0, allLines.length - lines ? lines : 0);
        let logString = '';
  
        for (let i = startIndex; i < allLines.length; i++) {
          const line = allLines[i].trim();
          if (line.length > 0) {
            logString += line;
            if (i < allLines.length - 1 && allLines[i + 1].trim().length > 0) {
              logString += '\n';
            }
          }
        }
        return logString;
      } catch (err) {
        console.error('Error reading log file:', err);
        return '<START>';
      }
    } else {
      return '<START>';
    }
  }
  
export async function setDiscordBotInfo(){
    let character = await getCharacter(botSettings.charId);
    
    // Attempt to change bot's username
    try {
      await disClient.user.setUsername(character.name);
      console.log(`My new username is ${character.name}`);
    } catch(error) {
      console.error(`Failed to set username to ${character.name}:`, error);
  
      // If the first attempt fails, add an underscore and try again
      try {
        let newName = "_" + character.name;
        await disClient.user.setUsername(newName);
        console.log(`My new username is ${newName}`);
      } catch(error) {
        console.error(`Failed to set username to ${newName}:`, error);
  
        // If the second attempt fails, add a dot and try again
        try {
          let newNameDot = "." + character.name;
          await disClient.user.setUsername(newNameDot);
          console.log(`My new username is ${newNameDot}`);
        } catch(error) {
          console.error(`Failed to set username to ${newNameDot}:`, error);
        }
      }
    }
  
    // Change bot's avatar
    const buffer = fs.readFileSync(`${CHARACTER_IMAGES_FOLDER}${character.avatar}`);
    disClient.user.setAvatar(buffer).then(user => {
      console.log('New avatar set!');
    }).catch(console.error);
  }
  
  
  
  async function getBotAppId(){
    let appId;
    try{
      appId = disClient.user.id
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
    return appId;
  }
  export async function setStatus(message, type){
    let activityType;
    switch (type) {
      case 'Playing':
        activityType = ActivityType.Playing;
        break;
      case 'Watching':
        activityType = ActivityType.Watching;
        break;
      case 'Listening':
        activityType = ActivityType.Listening;
        break;
      case 'Streaming':
        activityType = ActivityType.Streaming;
        break;
      case 'Competing':
        activityType = ActivityType.Competing;
        break;
      default:
        activityType = ActivityType.Playing;
        break;
    }
    disClient.user.setActivity(`${message}`, {type: activityType});
  }
  export async function setOnlineMode(type){
    disClient.user.setStatus(`${type}`);
  }
  export async function sendMessage(channelID, message){
    let channel = await disClient.channels.fetch(channelID);
    channel.send(message);
  }
  export function updateAlias(channelID, name, alias) {
    fs.readFile(aliasPath, 'utf8', function(err, data){
        if (err) {
            // If the file doesn't exist, create it with the provided alias
            if (err.code === 'ENOENT') {
                let aliases = {
                    'channels': [
                        {
                            'channelID': channelID,
                            'aliases': [
                                { 'name': name, 'alias': alias }
                            ]
                        }
                    ]
                };
                fs.writeFile(aliasPath, JSON.stringify(aliases, null, 2), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                    }
                });
            } else {
                console.log('An error occurred while reading the file: ', err);
            }
        } else {
            // If the file does exist, parse it, update it and save it
            let aliases = JSON.parse(data);
  
            let channel = aliases.channels.find(c => c.channelID === channelID);
  
            if (!channel) {
                channel = {
                    'channelID': channelID,
                    'aliases': []
                };
                aliases.channels.push(channel);
            }
  
            let userAlias = channel.aliases.find(a => a.name === name);
  
            if (userAlias) {
                userAlias.alias = alias;
            } else {
                channel.aliases.push({ 'name': name, 'alias': alias });
            }
  
            fs.writeFile(aliasPath, JSON.stringify(aliases, null, 2), function(err) {
                if(err) {
                    console.log(err);
                } else {
                }
            });
        }
    });
  }
  const _readFile = promisify(fs.readFile);
  
  export async function fetchAlias(channelID, name) {
    try {
      let data = await _readFile(aliasPath, 'utf8');
      let aliases = JSON.parse(data);
  
      let channel = aliases.channels.find(c => c.channelID === channelID);
  
      if (!channel) {
        return false;
      }
  
      let userAlias = channel.aliases.find(a => a.name === name);
  
      if (userAlias) {
        return userAlias.alias;
      } else {
        return false;
      }
  
    } catch (err) {
      console.log('An error occurred while reading the file: ', err);
      return false;
    }
  }
  
  export async function getUserName(channelID, username){
    let alias = await fetchAlias(channelID, username);
    if (alias === false) {
      return cleanUsername(username);
    } else {
      return alias;
    }
  }
  
  export function updateAuthorsNote(channelID, charId, authorsNote) {
    fs.readFile(notesPath, 'utf8', function(err, data){
        if (err) {
            // If the file doesn't exist, create it with the provided alias
            if (err.code === 'ENOENT') {
                let notes = {
                    'channels': [
                        {
                            'channelID': channelID,
                            'notes': [
                                { 'charId': charId, 'authorsNote': authorsNote }
                            ]
                        }
                    ]
                };
                fs.writeFile(notesPath, JSON.stringify(notes, null, 2), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                    }
                });
            } else {
                console.log('An error occurred while reading the file: ', err);
            }
        } else {
            // If the file does exist, parse it, update it and save it
            let notes = JSON.parse(data);
  
            let channel = notes.channels.find(c => c.channelID === channelID);
  
            if (!channel) {
                channel = {
                    'channelID': channelID,
                    'notes': []
                };
                notes.channels.push(channel);
            }
  
            let foundAuthorsNote = channel.notes.find(a => a.charId === charId);

            if (foundAuthorsNote) {
                foundAuthorsNote.authorsNote = authorsNote;
            } else {
                channel.notes.push({ 'charId': charId, 'authorsNote': authorsNote });
            }            
  
            fs.writeFile(notesPath, JSON.stringify(notes, null, 2), function(err) {
                if(err) {
                    console.log(err);
                } else {
                }
            });
        }
    });
  }
  
export async function fetchAuthorsNote(channelID, name) {
try {
    let data = await _readFile(notesPath, 'utf8');
    let notes = JSON.parse(data);

    let channel = notes.channels.find(c => c.channelID === channelID);

    if (!channel) {
    return false;
    }

    let authorsNote = channel.notes.find(a => a.charId === name);

    if (authorsNote) {
    return authorsNote.authorsNote;
    } else {
    return false;
    }

} catch (err) {
    console.log('An error occurred while reading the file: ', err);
    return false;
}
}

const rename = promisify(fs.rename);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

/**
 * Moves a file to a new location and renames it.
 * @param {string} name - Current name of the file.
 * @param {string} newName - New name of the file.
 */
export async function moveAndRenameFile(name, newName) {
    const currentPath = path.join('./public/discord/logs/', name);
    const newPath = path.join('./public/discord/archive/', newName);
    const newDir = path.dirname(newPath);

    // Check if source file exists
    if (!(await exists(currentPath))) {
        console.error(`Source file ${currentPath} does not exist.`);
        return;
    }

    // Check if destination directory exists, if not create it
    if (!(await exists(newDir))) {
        await mkdir(newDir, { recursive: true });
    }

    try {
        await rename(currentPath, newPath);
    } catch (err) {
        console.error(`Error moving file: ${err}`);
    }
}

export async function regenMessage(message){
  let originalContent = message.content;
  let channelID = message.channel.id;
  let charId = botSettings.charId;
  let logs = await getHistory(charId, channelID, true);

  let index = logs.findIndex(log => log.includes(originalContent));
  let elementsBefore;
  if (index != -1) { 
    elementsBefore = logs.slice(0, index);
  } else {
    console.log('No log contains the original content');
  }
  let elementsAfter = logs.slice(index + 1, logs.length);
  let newLogs = elementsBefore.concat(elementsAfter);
  let newLogString = newLogs.join('\n');
}
