import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';
const command = {
	data: new SlashCommandBuilder()
		.setName('delchannel')
		.setDescription('Removes the current channel from the bot.'),
	async execute(interaction) {
        await interaction.deferReply();
        botSettings.channels = botSettings.channels.filter(channel => channel !== interaction.channel.id);
        saveBotSettings(botSettings);
        await interaction.editReply(`**Removed channel from list.**`)
	},
};

export default command;