import { SlashCommandBuilder } from 'discord.js';
import { botSettings, getCharacter } from '../../../server.js';
import { moveAndRenameFile } from '../Discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Archives the current chat log.'),
	async execute(interaction) {
        await interaction.deferReply();
        let currentTimeString = new Date().toISOString().replace(/:/g, '-');
        let character = await getCharacter(botSettings.charId);
        const logName = `${interaction.channel.id}-${botSettings.charId}.log`;
        const newName = `${interaction.channel.id}-${botSettings.charId}-${currentTimeString}.log`;
        await moveAndRenameFile(logName, newName)
        await interaction.editReply(`**Archived log in ${interaction.channel.name} for** ${character.name}`)
	},
};

export default command;