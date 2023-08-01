import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('stopbrackets')
		.setDescription('Toggles the adding of brackets to the stoplist to on or off.')
        .addBooleanOption(option =>
            option.setName('on')
                .setDescription('Set to true to add brackets to the stoplist, false to remove.')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const type = interaction.options.getBoolean('on');
        botSettings.stopBrackets = type;
        saveBotSettings(botSettings);
        await interaction.editReply(`**Add Brackets to stoplist is: **\n${type ? 'On' : 'Off'}.`);
	},
};

export default command;