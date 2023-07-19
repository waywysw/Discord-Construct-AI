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
        let embed = new EmbedBuilder()
            .setTitle(character.name)
            .addFields(
                { name: 'Greeting', value: `${character.first_mes || 'None'}`, inline: false },
                { name: 'Description', value: `${character.description || 'None'}`, inline: false },
                { name: 'Scenario', value: `${character.scenario || 'None'}`, inline: false },
                { name: 'Example Dialogue', value: `${character.dialogue || 'None'}`, inline: false },
            )
            .setImage(`attachment://${character.name}.png`)
            .setColor(0x0099FF)
        await interaction.reply({ embeds: [embed], files: [attachment]});
	},
};

export default command;