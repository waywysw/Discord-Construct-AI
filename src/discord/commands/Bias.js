import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('bias')
		.setDescription('Adds a bias to the next message.')
        .addStringOption(option =>
            option.setName('bias')
                .setDescription('The bias to add.')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const message = interaction.options.getString('bias');
        GlobalState.bias = message;
        await interaction.editReply(`**Bias:**\n${GlobalState.bias}`)
	},
};

export default command;
