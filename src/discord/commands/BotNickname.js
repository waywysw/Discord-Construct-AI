import { Guild, SlashCommandBuilder } from 'discord.js';
import GlobalState from '../GlobalState.js';
import { disClient } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('botnick')
		.setDescription('Changes the nickname of the bot.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The new nickname for the bot.')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        if(!interaction.guild){
            await interaction.editReply('**Error:**\nThis command must be used in a server.');
            return;
        }
        const guild = disClient.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(disClient.user.id);
        await member.setNickname(name);
        await interaction.editReply(`**Bot Nickname:**\n${name}`);
	},
};

export default command;
