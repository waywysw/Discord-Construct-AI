import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, generateText, getCharacter, CHARACTER_IMAGES_FOLDER} from '../../../server.js';
import { getPrompt, breakUpCommands, saveConversation, sendMessage, getUserName, getStopList } from '../Discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('sys')
		.setDescription('Adds an system message to the context and prompts a reply.')
        .addStringOption(option =>
            option.setName('systemmessage')
                .setDescription('The system message to add to the context')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const message = interaction.options.getString('systemmessage');
        GlobalState.sysMes = message;
        let channelID = interaction.channel.id;
        await interaction.editReply(`**System:**\n${GlobalState.sysMes}`)
        let charId = botSettings.charId;
        let endpointType = botSettings.endpointType;
        let character = await getCharacter(charId);
        let prompt = await getPrompt(charId, interaction, true, GlobalState.sysMes)
        let results;
        console.log("Generating text...");
        let username = await getUserName(channelID, interaction.user.username);
        let stopList = await getStopList(interaction.guild.id, channelID)
        try{
          results = await generateText(prompt, username, stopList);
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
        let responses = breakUpCommands(character.name, generatedText, username, stopList);
        let response = responses.join('\n');
        response = response.replace(new RegExp(removeAble, 'g'), '').replace(new RegExp('\n', 'g'), '').trim();
        if(response === undefined){
          console.log("Response is undefined");
          return;
        }
        if(response !== undefined){
          await saveConversation(interaction, charId, `${message}`);
          await saveConversation(interaction, charId, `${character.name}: ${response.replace(/<user>/g, username).replace(removeAble, '')}`);
        }
        await sendMessage(channelID, response.replace(/<user>/g, username))
	},
};
export default command;
