import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';
const command = {
	data: new SlashCommandBuilder()
		.setName('addchannel')
		.setDescription('Adds the current channel to the bot.'),
	async execute(interaction) {
        await interaction.deferReply();
        botSettings.channels.push(interaction.channel.id);
        saveBotSettings(botSettings);
        await interaction.editReply(`**Added channel to list.**`)
	},
};

export default command;