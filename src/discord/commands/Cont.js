import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, cleanUsername, disClient, generateText, getCharacter, getPrompt, parseTextEnd, removeLastLines, saveConversation } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('cont')
		.setDescription('Continues from the last message sent.'),
	async execute(interaction) {
        interaction.deferReply();
        let charId = botSettings.charId;
        let endpoint = botSettings.endpoint;
        let endpointType = botSettings.endpointType;
        let settings = botSettings.settings;
        let hordeModel = botSettings.hordeModel;
        let character = await getCharacter(charId);
        let prompt = await getPrompt(charId, interaction, true, null, true);
        let results;
        console.log("Generating text...");
        try {
            results = await generateText(endpointType, { endpoint: endpoint, configuredName: cleanUsername(interaction.user.username), prompt: prompt, settings: settings, hordeModel: hordeModel});
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
        text = `${character.name}: ${response[0].replace(/<user>/g, interaction.user.username).replace(removeAble, '')}\n`;
        await saveConversation(interaction, charId, text);
        await interaction.editReply(response[0].replace(/<user>/g, interaction.user.username));
	},
};
export default command;
