import { SlashCommandBuilder } from 'discord.js';
import { botSettings, getCharacter } from '../../../server.js';
import { saveConversation } from '../Discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('greeting')
		.setDescription(`Sends the selected character's greeting message.`),
	async execute(interaction) {
        let character = await getCharacter(botSettings.charId);
		await interaction.deferReply();
		await interaction.editReply(`${character.first_mes}`)
        let text = `${character.name}: ${character.first_mes.replace(/\n/g,'')}`;
        await saveConversation(interaction, botSettings.charId, text);
	},
};

export default command;