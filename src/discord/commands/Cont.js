import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, generateText, getCharacter} from '../../../server.js';
import { getPrompt, breakUpCommands, saveConversation, getUserName, sendMessage  } from '../Discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('cont')
		.setDescription('Continues from the last message sent.'),
	async execute(interaction) {
        interaction.deferReply({ephemeral: true});
        let channelID = interaction.channelId;
        let charId = botSettings.charId;
        let endpointType = botSettings.endpointType;
        let character = await getCharacter(charId);
        let prompt = await getPrompt(charId, interaction, true, null, true);
        let results;
        let username = await getUserName(channelID, interaction.user.username);
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
        response = response.replace(new RegExp(removeAble, 'g'), '').replace(new RegExp('\n', 'g'), '').trim();
        if(response === undefined){
          console.log("Response is undefined");
          return;
        }
        if(response !== undefined){
          await saveConversation(interaction, charId, `${character.name}: ${response.replace(/<user>/g, username).replace(removeAble, '')}`);
        }
        await sendMessage(channelID, response.replace(/<user>/g, username))
        await interaction.editReply({content: 'Continue sucessful.', empheral: true});
	},
};
export default command;
