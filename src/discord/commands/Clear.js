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
        const channel = interaction.channel;
        let count = 0;
        try {
            const messages = await channel.messages.fetch({ limit: 100 });
            for (const message of messages.values()) {
                if (message.content.startsWith('.') || message.reference) {
                    await message.delete();
                } else if (count < lines) {
                    await message.delete();
                    count++;
                } else {
                    break;
                }
            }
        } catch (error) {
            console.log(error);
        }
        await interaction.editReply(`**Cleared ${count} messages from this channel.**`);
        const logName = `${interaction.channel.id}-${botSettings.charId}.log`;
        try {
            removeLastLines(logName, lines);
        } catch (error) {
            console.log('Error:', error);
        }
    },
};

export default command;
