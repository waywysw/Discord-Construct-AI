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
        const depth = interaction.options.getInteger('depth');
        await interaction.reply(`Authors note depth set to ${depth}!`);
    },
};

export default command;
