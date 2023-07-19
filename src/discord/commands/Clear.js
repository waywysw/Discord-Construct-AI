import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { botSettings,  } from '../../../server.js';
import { removeLastLines } from '../Discord.js';
const command = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the last given number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('lines')
                .setDescription('The amount of lines to clear.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const lines = interaction.options.getInteger('lines');
        await interaction.editReply(`**Cleared ${lines} messages from this channel's log.**`);
        const logName = `${interaction.channel.id}-${botSettings.charId}.log`;
        try {
            await removeLastLines(logName, lines);
        } catch (error) {
            console.log('Error:', error);
        }
    },
};

export default command;
