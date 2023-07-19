import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botSettings, fetchCharacters } from '../../../server.js';
import { fetchAuthorsNote, setDiscordBotInfo } from "../Discord.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("swapchar")
    .setDescription("Swaps a character based on name")
    .addStringOption(option => option.setName('character').setDescription('The name of the character to swap to').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const characters = await fetchCharacters()
    const characterName = interaction.options.getString('character');
    const characterData = characters.find(character => character.name.toLowerCase() === characterName.toLowerCase());
    if(!characterData) {
        await interaction.editReply({ content: `Could not find character with name ${characterName}`, empheral: true });
        return;
    }
    botSettings.charId = characterData.char_id;
    setDiscordBotInfo(botSettings);
    await interaction.editReply({ content: `Swapped to character ${characterName}`, empheral: true });
  },
};

export default command;
