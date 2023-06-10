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
        const client = interaction.client;
        await interaction.deferReply();
        const message = interaction.options.getString('authorsnote');
        client.authorsNote = message;
        await interaction.editReply(`Authors note set to ${client.authorsNote}!`)
	},
};

export default command;
