import { botReady, botSettings, disClient, generateText, getCharacter, CHARACTER_IMAGES_FOLDER, notesPath, aliasPath } from "../../server.js";
import GlobalState from "./GlobalState.js";
import { promisify } from 'util';
import { ActivityType } from 'discord.js';
import path from 'path';
import fs from 'fs-extra';

export async function doCharacterChat(message){
    let charId = botSettings.charId;
    let endpointType = botSettings.endpointType;
    let prompt = await getPrompt(charId, message);
    let character = await getCharacter(charId);
    let results;
    let username = await getUserName(message.channel.id, message.author.username);
    console.log("Generating text...")
    try{
      results = await generateText(prompt, username);
    } catch (error) {
      console.log('Error:', error)
      return;
    }
    if(results.results === undefined){
      console.log("Results are undefined");
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
    let responses = breakUpCommands(character.name, generatedText, username);
    let response = responses.join('\n');
    response = response.replace(new RegExp(removeAble, 'g'), '');
    if(response === undefined){
      console.log("Response is undefined");
      return;
    }
    if(GlobalState.bias.length > 0 && response !== undefined){
      await saveConversation(message, charId, `${username}: ${message.cleanContent}`);
      await saveConversation(message, charId, `${character.name}: ${GlobalState.bias}${response.replace(/<user>/g, username).replace(removeAble, '')}`);
    }else if(response !== undefined){
      await saveConversation(message, charId, `${username}: ${message.cleanContent}`);
      await saveConversation(message, charId, `${character.name}: ${response.replace(/<user>/g, username).replace(removeAble, '')}`);
    }
    if (Math.random() < 0.75) {
      // 75% chance to reply directly to the message
      message.reply(`${GlobalState.bias} ${response.replace(/<user>/g, username).replace(removeAble, '')}`);
    } else {
      // 25% chance to just send a message to the channel
      message.channel.send(`${GlobalState.bias} ${response.replace(/<user>/g, username).replace(removeAble, '')}`);
    };
    GlobalState.bias = '';
  };
  
export async function saveConversation(message, charId, text){
  const logName = `${message.channel.id}-${charId}.log`;
  const pathName = path.join('./public/discord/logs/', logName);
  let data;
  // Check if the directory exists, and if it doesn't, create it
  await fs.ensureDir(path.dirname(pathName));
  //check if the file exists
  if (fs.existsSync(pathName)) {
    try {
      data = await fs.readJSON(pathName, 'utf8');
    } catch (e) {
      console.error("Error parsing JSON, defaulting to initial state.", e);
      data = {
        'channelID': message.channel.id,
        'charId': charId,
        'messages': []
      };
    }
    data.messages.push(text);
    await fs.writeJSON(pathName, data, 'utf8');
  } else {
    data = {
      'channelID': message.channel.id,
      'charId': charId,
      'messages': [text]
    };
    await fs.writeJSON(pathName, data, 'utf8');
  }
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
  
  export async function removeLastLines(filename, numLinesToRemove) {
    const pathName = path.join('./public/discord/logs/', filename);
    // Read the file into a string
    if(!fs.existsSync(pathName)){
      return;
    }
    let fileContent = await fs.readJSON(pathName, 'utf-8');
    // Check if the number of lines to remove is greater than the total number of lines
    if (numLinesToRemove >= fileContent.messages.length) {
      // If it is, just clear the file
      fileContent.messages = [];
      await fs.writeJSON(pathName, fileContent, 'utf8');
    } else {
      fileContent = fileContent.messages.splice(0, fileContent.messages.length - numLinesToRemove);
      await fs.writeJSON(pathName, fileContent, 'utf8');
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
        convo += '\n' + currentMessage + '\n';
      }
    }
    const authorsNote = await fetchAuthorsNote(channelID, charId);
    
    let basePrompt = '';
    if(character.description.length > 1){
      basePrompt += character.description + '\n';
    }
    if(character.scenario.length > 1){
      basePrompt += 'Scenario:\n' + character.scenario + '\n';
    }
    if(character.mes_example.length > 1){
      basePrompt += 'Example Dialogue:\n' + character.mes_example + '\n';
    }
    let createdPrompt = basePrompt + convo + character.name + ':';
    
    if(GlobalState.bias.length > 0){
      createdPrompt += '' + GlobalState.bias;
    }
    if(authorsNote !== false){
      if(authorsNote.length > 0){
        createdPrompt = insertAtLineFromEnd(createdPrompt, GlobalState.authorsNoteDepth, authorsNote);
      }
    }
    createdPrompt = cleanEmoji(createdPrompt);
    createdPrompt = createdPrompt.replace(/^\s*\n+|\n+\s*$/g,'').replace(/\n\s*\n/g,'\n').replace(/^\s*\n+|\n+\s*$/g,'').replace(/\n\s*\n/g,'\n').replace(/ +/g, ' ')
    return createdPrompt.replace(/{{char}}/g, character.name).replace(/{{user}}/g, user).replace(/\r/g, '').replace(/<USER>/g, user)
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
  
  export function breakUpCommands(charName, commandString, user = 'You') {
    let lines = commandString.split('\n');
    let formattedCommands = [];
    let currentCommand = '';
    let isFirstLine = true;
    
    for (let i = 0; i < lines.length; i++) {
        // If the line starts with a colon, it's the start of a new command
        let lineToTest = lines[i].toLowerCase();
        if (lineToTest.startsWith(`${user.toLowerCase()}:`) || lineToTest.startsWith('you:') || lineToTest.startsWith('<start>') || lineToTest.startsWith('<end>') || lineToTest.startsWith('<user>') || lineToTest.toLowerCase().startsWith('user:') ) {
          break;
        }
        if (lineToTest.startsWith(`${charName}:`)) {
            isFirstLine = false;
            if (currentCommand !== '') {
                // Push the current command to the formattedCommands array
                formattedCommands.push(currentCommand);
            }
            currentCommand = lines[i];
        } else {
            if(currentCommand !== '' || isFirstLine){
                currentCommand += (isFirstLine ? '' : '\n') + lines[i];
            }
            if(isFirstLine) isFirstLine = false;
        }
    }
    
    // Don't forget to add the last command
    if (currentCommand !== '') {
        formattedCommands.push(currentCommand);
    }
    
    return formattedCommands;
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
    let messageString = '';
    if (fs.existsSync(pathName)) {
      try {
        const data = await fs.readJSON(pathName, 'utf8');
        console.log(data);
        data.messages = data.messages.filter(message => message !== '');
        for(let i = 0; i < data.messages.length; i++){
          data.messages[i] = data.messages[i].replace(/<user>/g, '');
        }
        if(lines) {
          data.messages = data.messages.slice(-lines);
        }
        for(let i = 0; i < data.messages.length; i++){
          data.messages[i] = data.messages[i].replace(/<user>/g, '');
        }
        messageString = data.messages.join('\n');
        return messageString;
      } catch (err) {
        console.error('Error reading log file:', err);
        return '';
      }
    } else {
      return '';
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
  
export async function fetchAuthorsNote(channelID, charId) {
try {
    let notes = await fs.readJSON(notesPath, 'utf8');

    let channel = notes.channels.find(c => c.channelID === channelID);

    if (!channel) {
      console.log('No channel found');
      return false;
    }

    let authorsNote = channel.notes.find(a => a.charId === charId);

    if (authorsNote) {
      console.log('Found authors note:', authorsNote.authorsNote);
      return authorsNote.authorsNote;
    } else {
      console.log('No authors note found');
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
