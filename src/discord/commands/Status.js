import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { setOnlineMode } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Sets the bot status to Online, Invisible, or Do Not Disturb.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of status to display.')
                .setRequired(true)
                .addChoices({name: 'Online', value: 'online'}, {name: 'Do Not Disturb', value: 'dnd'}, {name: 'Idle', value: 'idle'}, {name: 'Invisible', value: 'invisible'}, )),
	async execute(interaction) {
        await interaction.deferReply();
        const type = interaction.options.getString('type');
        await setOnlineMode(type);
        await interaction.editReply(`**Status set to:**\n${type}.`);
	},
};

export default command;