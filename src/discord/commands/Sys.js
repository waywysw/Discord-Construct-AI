import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, generateText, getCharacter, CHARACTER_IMAGES_FOLDER} from '../../../server.js';
import { getPrompt, parseTextEnd, saveConversation, sendMessage, getUserName } from '../Discord.js';

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
        let username = await getUserName(channelID, interaction.user.username);
        try {
            results = await generateText(endpointType, { endpoint: endpoint, configuredName: username, prompt: prompt, settings: settings, hordeModel: hordeModel});
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
        text = `${message}\n${character.name}: ${response[0].replace(/<user>/g, username).replace(removeAble, '')}\n`;
        await saveConversation(interaction, charId, text);
        await sendMessage(channelID, response[0].replace(/<user>/g, username))
	},
};
export default command;
