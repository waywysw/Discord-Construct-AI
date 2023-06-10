import { SlashCommandBuilder } from 'discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sends a "Pong!" message'),
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply('Pong!')
	},
};

export default command;