import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, cleanUsername, disClient, generateText, getCharacter, getPrompt, parseTextEnd, removeLastLines, saveConversation } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('regen')
		.setDescription('Adds an system message to the context and prompts a reply.'),
	async execute(interaction) {
        interaction.deferReply();
        // Fetch last 20 messages from the channel.
        const messages = await interaction.channel.messages.fetch({ limit: 20 });

        // Filter the bot's messages and convert to array.
        const botMessages = Array.from(messages.filter(msg => msg.author.bot).values());

        // Check if there are at least two bot messages.
        if (botMessages.length >= 2) {
            // Get the second to last bot message.
            const secondLastBotMessage = botMessages[1];

            // Delete the second to last bot message.
            secondLastBotMessage.delete().catch(console.error);
        }
        let charId = botSettings.charId;
        let endpoint = botSettings.endpoint;
        let endpointType = botSettings.endpointType;
        let settings = botSettings.settings;
        let hordeModel = botSettings.hordeModel;
        const logName = `${interaction.channel.id}-${botSettings.charId}.log`;
        removeLastLines(logName, 1);
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
        }
        let response = parseTextEnd(generatedText);
        console.log("Response: ", response);
        let text = `${character.name}: ${response[0].replace(/<user>/g, interaction.user.username)}\n`;
        await saveConversation(interaction, charId, text);
        await interaction.editReply(response[0].replace(/<user>/g, interaction.user.username));
	},
};
export default command;
