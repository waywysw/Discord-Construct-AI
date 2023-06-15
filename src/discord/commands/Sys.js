import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, cleanUsername, disClient, generateText, getCharacter, getPrompt, parseTextEnd, saveConversation, sendMessage } from '../../../server.js';

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
        let channelID = interaction.channelId;
        await interaction.editReply(`**System:**\n${GlobalState.sysMes}`)
        let charId = botSettings.charId;
        let endpoint = botSettings.endpoint;
        let endpointType = botSettings.endpointType;
        let settings = botSettings.settings;
        let hordeModel = botSettings.hordeModel;
        let character = await getCharacter(charId);
        let prompt = await getPrompt(charId, interaction, true, GlobalState.sysMes)
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
        }
        let response = parseTextEnd(generatedText)
        console.log("Response: ", response);
        let text = `### ${GlobalState.sysMes}\n${character.name}: ${response[0].replace(/<user>/g, interaction.user.username)}\n`;
        await saveConversation(interaction, charId, text);
        await sendMessage(channelID, response[0].replace(/<user>/g, interaction.user.username))
	},
};
export default command;
