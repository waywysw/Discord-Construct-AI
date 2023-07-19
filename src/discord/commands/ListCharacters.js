import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botSettings, fetchCharacters } from '../../../server.js';
import { fetchAuthorsNote } from "../Discord.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("charlist")
    .setDescription("Displays all available characters."),
  async execute(interaction) {
    await interaction.deferReply();
    const characters = await fetchCharacters()
    let embedArray = [];
    for(let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const characterName = character.name;
      let active = 'Inactive';
      if(character.char_id === botSettings.charId) {
        active = 'Active';
      }
      let note = {name: `${characterName}`, value: active, inline: false};
      embedArray.push(note);
    }
    let embed = new EmbedBuilder()
        .setTitle(`Characters`)
        .addFields(embedArray)
        .setColor(0x0099FF);
    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
