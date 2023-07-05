import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, generateText, getCharacter} from '../../../server.js';
import { getPrompt, parseTextEnd, saveConversation, getUserName  } from '../Discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('cont')
		.setDescription('Continues from the last message sent.'),
	async execute(interaction) {
        interaction.deferReply();
        let channelID = interaction.channelId;
        let charId = botSettings.charId;
        let endpointType = botSettings.endpointType;
        let character = await getCharacter(charId);
        let prompt = await getPrompt(charId, interaction, true, null, true);
        let results;
        let username = await getUserName(channelID, interaction.user.username);
        console.log("Generating text...");
        try {
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
        console.log("Response: ", response);
        let text;
        text = `${character.name}: ${response[0].replace(/<user>/g, username).replace(removeAble, '')}\n`;
        await saveConversation(interaction, charId, text);
        await interaction.channel.send(response[0].replace(/<user>/g, username));
        await interaction.editReply({content: '', empheral: true});
	},
};
export default command;
