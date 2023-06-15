import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { setStatus } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('presence')
		.setDescription('Sets the bot status to a custom message.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The custom message to set as the bot presence.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of activity to display.')
                .setRequired(true)
                .addChoices({name: 'Playing', value: 'Playing'}, {name: 'Watching', value: 'Watching'}, {name: 'Listening', value: 'Listening'}, {name: 'Streaming', value: 'Streaming'})),
	async execute(interaction) {
        await interaction.deferReply();
        const message = interaction.options.getString('message');
        const type = interaction.options.getString('type');
        await setStatus(message, type);
        await interaction.editReply(`**Presence set to:**\n ${type} ${message}.`);
	},
};

export default command;