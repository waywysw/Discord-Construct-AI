import { SlashCommandBuilder } from 'discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('Adds an authors note to the context.')
        .addStringOption(option =>
            option.setName('authorsnote')
                .setDescription('The authors note to add to the context')
                .setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('authorsnote');
        await interaction.reply(`Authors note set to ${message}!`)
	},
};

export default command;
