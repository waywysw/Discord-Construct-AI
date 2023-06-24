import { SlashCommandBuilder } from 'discord.js';
import { botSettings } from '../../../server.js';
import { updateAuthorsNote } from '../Discord.js';
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
        updateAuthorsNote(interaction.channel.id, botSettings.charId, message)
        await interaction.editReply(`**Author's Note:**\n${message}`)
	},
};

export default command;
