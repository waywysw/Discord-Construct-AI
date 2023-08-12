import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('set-setting')
		.setDescription('Changes the generation settings of the LLM'),
	async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply(`Boop! This command is not yet implemented.`);
	},
};

export default command;