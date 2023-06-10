import { SlashCommandBuilder } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('andepth')
        .setDescription('Changes the line insertion depth of the authors note.')
        .addIntegerOption(option =>
            option.setName('depth')
                .setDescription('The depth for the authors note')
                .setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply();
        const depth = interaction.options.getInteger('depth');
        client.authorsNoteDepth = depth;
        await interaction.editReply(`Authors note depth set to ${client.authorsNoteDepth}!`);
    },
};

export default command;
