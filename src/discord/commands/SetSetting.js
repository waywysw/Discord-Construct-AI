import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { botSettings, saveBotSettings } from '../../../server.js';

const command = {
    data: new SlashCommandBuilder()
    .setName('set-settings')
    .setDescription('Changes the settings of the bot.')
    .addIntegerOption(
        option => option.setName('max-context-length')
            .setDescription('The maximum number of tokens to use in the context.')
            .setRequired(false)
    )
    .addIntegerOption(
        option => option.setName('max-length')
            .setDescription('The maximum number of tokens to generate as a response.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('rep-pen')
            .setDescription('Rep pen value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('rep-pen-range')
            .setDescription('Rep pen range value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('rep-pen-slope')
            .setDescription('Rep pen slope value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('temperature')
            .setDescription('Temperature value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('tfs')
            .setDescription('TFS value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('top-a')
            .setDescription('Top A value.')
            .setRequired(false)
    )
    .addIntegerOption(
        option => option.setName('top-k')
            .setDescription('Top K value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('top-p')
            .setDescription('Top P value.')
            .setRequired(false)
    )
    .addNumberOption(
        option => option.setName('typical')
            .setDescription('Typical value.')
            .setRequired(false)
    )
    .addStringOption(
        option => option.setName('sampler-order')
            .setDescription('Sampler order values (comma-separated).')
            .setRequired(false)
    ),
    async execute(interaction) {
        await interaction.deferReply();
        let settings = botSettings.settings;
        const maxContextLength = interaction.options.getInteger('max-context-length');
        const maxLength = interaction.options.getInteger('max-length');
        const repPen = interaction.options.getNumber('rep-pen');
        const repPenRange = interaction.options.getNumber('rep-pen-range');
        const repPenSlope = interaction.options.getNumber('rep-pen-slope');
        const temperature = interaction.options.getNumber('temperature');
        const tfs = interaction.options.getNumber('tfs');
        const topA = interaction.options.getNumber('top-a');
        const topK = interaction.options.getInteger('top-k');
        const topP = interaction.options.getNumber('top-p');
        const typical = interaction.options.getNumber('typical');
        const samplerOrder = interaction.options.getString('sampler-order');
        if(maxContextLength){
            settings.max_context_length = maxContextLength;
        }
        if(maxLength){
            settings.max_length = maxLength;
        }
        if(repPen){
            settings.rep_pen = repPen;
        }
        if(repPenRange){
            settings.rep_pen_range = repPenRange;
        }
        if(repPenSlope){
            settings.rep_pen_slope = repPenSlope;
        }
        if(temperature){
            settings.temperature = temperature;
        }
        if(tfs){
            settings.tfs = tfs;
        }
        if(topA){
            settings.top_a = topA;
        }
        if(topK){
            settings.top_k = topK;
        }
        if(topP){
            settings.top_p = topP;
        }
        if(typical){
            settings.typical = typical;
        }
        if(samplerOrder){
            settings.sampler_order = samplerOrder.split(',');
        }
        botSettings.settings = settings;
        saveBotSettings();
        const embed = new EmbedBuilder()
            .setTitle('Settings')
            .setDescription('Current settings of the bot.')
            .addField('max_context_length', settings.max_context_length, true)
            .addField('max_length', settings.max_length, true)
            .addField('rep_pen', settings.rep_pen, true)
            .addField('rep_pen_range', settings.rep_pen_range, true)
            .addField('rep_pen_slope', settings.rep_pen_slope, true)
            .addField('temperature', settings.temperature, true)
            .addField('tfs', settings.tfs, true)
            .addField('top_a', settings.top_a, true)
            .addField('top_k', settings.top_k, true)
            .addField('top_p', settings.top_p, true)
            .addField('typical', settings.typical, true)
            .addField('sampler_order', settings.sampler_order.join(', '), true)
            .setColor('#00ff00')
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    },
};

export default command;
