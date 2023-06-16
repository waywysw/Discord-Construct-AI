import { SlashCommandBuilder } from "discord.js";
import GlobalState from "../GlobalState.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("whatnote")
    .setDescription("Display the current Author's Note."),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.editReply(
      `**Author's Note:**\n ${GlobalState.authorsNote}`
    );
  },
};

export default command;
