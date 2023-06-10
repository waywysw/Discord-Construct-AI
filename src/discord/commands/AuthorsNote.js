import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('Adds an authors note to the context.')
        .addStringOption(option =>
            option.setName('authorsnote')
                .setDescription('The authors note to add to the context')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const message = interaction.options.getString('authorsnote');
        GlobalState.authorsNote = message;
        await interaction.editReply(`Authors note set to: **${GlobalState.authorsNote}**`)
	},
};

export default command;
