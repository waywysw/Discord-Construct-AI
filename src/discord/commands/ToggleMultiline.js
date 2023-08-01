import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('multiline')
		.setDescription('Toggles multiline to true or false.')
        .addBooleanOption(option =>
            option.setName('on')
                .setDescription('The boolean to set multiline to.')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const type = interaction.options.getBoolean('on');
        botSettings.doMultiLine = type;
        saveBotSettings(botSettings);
        await interaction.editReply(`**Multiline Response is: **\n${type ? 'On' : 'Off'}.`);
	},
};

export default command;