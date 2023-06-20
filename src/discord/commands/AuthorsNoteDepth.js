import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('andepth')
        .setDescription('Changes the line insertion depth of the authors note.')
        .addIntegerOption(option =>
            option.setName('depth')
                .setDescription('The depth for the authors note')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const depth = interaction.options.getInteger('depth');
        GlobalState.authorsNoteDepth = depth;
        await interaction.editReply(`**Author's Note Depth:**\n${GlobalState.authorsNoteDepth}`);
    },
};

export default command;
