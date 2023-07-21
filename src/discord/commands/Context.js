import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings, generateText, getCharacter, CHARACTER_IMAGES_FOLDER} from '../../../server.js';
import { getPrompt, breakUpCommands, saveConversation, sendMessage, getUserName } from '../Discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('context')
		.setDescription('Sends the current promt'),
	async execute(interaction) {
    let charId = botSettings.charId;
    let prompt = await getPrompt(charId, interaction, true)
    let embed = new EmbedBuilder()
      .setTitle('Prompt')
      .setDescription(prompt)
    interaction.reply({embeds: [embed]});
	},
};
export default command;
