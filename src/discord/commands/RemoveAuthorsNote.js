import { SlashCommandBuilder } from 'discord.js';
import { botSettings } from '../../../server.js';
import { updateAuthorsNote } from '../Discord.js';
const command = {
	data: new SlashCommandBuilder()
		.setName('removenote')
		.setDescription('Adds an authors note to the context.'),
	async execute(interaction) {
        await interaction.deferReply();
        updateAuthorsNote(interaction.channel.id, botSettings.charId, '')
        await interaction.editReply(`**Author's Note Cleared**`)
	},
};

export default command;
