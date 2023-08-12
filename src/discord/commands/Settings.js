import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Shows the current settings of the bot.'),
    async execute(interaction) {
        await interaction.deferReply();
        let settings = botSettings.settings;
        let embedArray = [];
        for (const [key, value] of Object.entries(settings)) {
            embedArray.push({name: `${key}`, value: `${value}`, inline: false});
        }
        let embed = new EmbedBuilder()
            .setTitle('Settings')
            .setDescription('Current settings of the bot.')
            .addFields(embedArray)
            .setColor(0x0099FF);
        await interaction.editReply({ embeds: [embed] });
    },
};

export default command;
