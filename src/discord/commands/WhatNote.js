import { SlashCommandBuilder } from "discord.js";
import { botSettings } from '../../../server.js';
import { fetchAuthorsNote } from "../Discord.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("whatnote")
    .setDescription("Display the current Author's Note."),
  async execute(interaction) {
    await interaction.deferReply();
    const AuthorNote = await fetchAuthorsNote(interaction.channel.id, botSettings.charId);
    if (!AuthorNote) {
      await interaction.editReply(`There is not an Author's Note set.`);
    } else if (AuthorNote) {
      await interaction.editReply(`**Author's Note:**\n${AuthorNote}`)
    }
  },
};

export default command;
