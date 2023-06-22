import { SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { updateAlias } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('alias')
		.setDescription('Sets a users nickname in the context.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name shown in the context.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to set the alias for.')
                .setRequired(false)),
	async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        let user = interaction.options.getUser('user');
        if(!user){
            user = interaction.user.username;
        }
        updateAlias(interaction.channel.id, user, name);
        await interaction.editReply(`**Alias for ${user} in ${interaction.channel.name} set to:** ${name}`)
	},
};

export default command;