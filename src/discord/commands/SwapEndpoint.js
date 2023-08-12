import { SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('endpoint')
		.setDescription('Changes the LLM endpoint the bot uses.')
        .addStringOption(option =>
            option.setName('endpoint-type')
                .setDescription('The endpoint the bot uses.')
                .setRequired(true)
                .addChoices(
                    {name: 'Oobabooga Text Generation WebUI', value: 'Ooba'},
                    {name: 'Kobold', value: 'Kobold'},
                    {name: 'Horde', value: 'Horde'},
                    {name: 'OpenAI', value: 'OAI'},
                    {name: 'OpenAI Proxy', value: 'P-OAI'},
                    {name: 'Claude Proxy', value: 'P-Claude'},
                ))
        .addStringOption(option =>
            option.setName('endpoint')
                .setDescription('The endpoint the bot uses.')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const endpoint = interaction.options.getString('endpoint');
        const endpointType = interaction.options.getString('endpoint-type');
        botSettings.endpoint = endpoint;
        botSettings.endpointType = endpointType;
        saveBotSettings(botSettings);
        await interaction.editReply(`**Endpoint set to:**\n${endpointType} ${endpoint}.`);
	},
};

export default command;