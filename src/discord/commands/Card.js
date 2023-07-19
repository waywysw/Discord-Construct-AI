import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CHARACTER_IMAGES_FOLDER, botSettings, disClient, getCharacter } from '../../../server.js';
import { saveConversation } from '../Discord.js';
import path from 'path';
import fs from 'fs-extra';

const command = {
	data: new SlashCommandBuilder()
		.setName('showcard')
		.setDescription(`Gets all details on the current character.`),
	async execute(interaction) {
        let character = await getCharacter(botSettings.charId);
        const attachment = new AttachmentBuilder(`${CHARACTER_IMAGES_FOLDER}${character.avatar}`, {name: `${character.name}.png`});
        let embedArray = [];
        if(character.first_mes.length > 800){
            embedArray.push({ name: 'Greeting', value: `${character.first_mes.slice(0, 800)}`, inline: false });
            embedArray.push({ name: 'Greeting Continued', value: `${character.first_mes.slice(800, 1600)}`, inline: false });
            if(character.first_mes.length > 1600){
                embedArray.push({ name: 'Greeting Continued', value: `${character.first_mes.slice(1600)}`, inline: false });
            }
        }else{
            embedArray.push({ name: 'Greeting', value: `${character.first_mes || 'None'}`, inline: false });
        }
        if(character.description.length > 800){
            embedArray.push({ name: 'Description', value: `${character.description.slice(0, 800)}`, inline: false });
            embedArray.push({ name: 'Description Continued', value: `${character.description.slice(800, 1600)}`, inline: false });
            if(character.description.length > 1600){
                embedArray.push({ name: 'Description Continued', value: `${character.description.slice(1600)}`, inline: false });
            }
        }else{
            embedArray.push({ name: 'Description', value: `${character.description || 'None'}`, inline: false });
        }
        if(character.scenario.length > 800){
            embedArray.push({ name: 'Scenario', value: `${character.scenario.slice(0, 800)}`, inline: false });
            embedArray.push({ name: 'Scenario Continued', value: `${character.scenario.slice(800, 1600)}`, inline: false });
            if(character.scenario.length > 1600){
                embedArray.push({ name: 'Scenario Continued', value: `${character.scenario.slice(1600)}`, inline: false });
            }
        }else{
            embedArray.push({ name: 'Scenario', value: `${character.scenario || 'None'}`, inline: false });
        }
        if(character.mes_example.length > 800){
            embedArray.push({ name: 'Examples', value: `${character.mes_example.slice(0, 800)}`, inline: false });
            embedArray.push({ name: 'Examples Continued', value: `${character.mes_example.slice(800, 1600)}`, inline: false });
            if(character.mes_example.length > 1600){
                embedArray.push({ name: 'Examples Continued', value: `${character.mes_example.slice(1600)}`, inline: false });
            }
    
        }else{
            embedArray.push({ name: 'Examples', value: `${character.mes_example || 'None'}`, inline: false });
        }
        let embed = new EmbedBuilder()
            .setTitle(character.name)
            .addFields(embedArray)
            .setImage(`attachment://${character.name}.png`)
            .setColor(0x0099FF)
        await interaction.reply({ embeds: [embed], files: [attachment]});
	},
};

export default command;