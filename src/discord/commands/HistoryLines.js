import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('historylines')
        .setDescription('Changes the amount of lines in the log to put in the prompt.')
        .addIntegerOption(option =>
            option.setName('lines')
                .setDescription('The amount of lines in the prompt.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const depth = interaction.options.getInteger('lines');
        botSettings.historyLength = depth;
        saveBotSettings(botSettings);
        await interaction.editReply(`**History Length**:\n${botSettings.historyLength}`);
    },
};

export default command;
