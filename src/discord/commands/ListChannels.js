import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';
const command = {
	data: new SlashCommandBuilder()
		.setName('listchannels')
		.setDescription('Lists the channels the bot is currently active in.'),
	async execute(interaction) {
        await interaction.deferReply();
        let channels = '';
        botSettings.channels.forEach(channel => {
            channels += `<#${channel}>\n`;
        }
        )
        await interaction.editReply(`**Channels:**\n${channels}`)
	},
};

export default command;