import { SlashCommandBuilder } from 'discord.js';

const command = {
	data: new SlashCommandBuilder()
		.setName('starfield')
		.setDescription('See how long until Starfield is released.'),
	async execute(interaction) {
        let string = getTimeUntilRelease();
		await interaction.deferReply();
		await interaction.editReply(string)
	},
};

export default command;

function getTimeUntilRelease() {
    // Get current date and time
    let now = new Date();
    
    // Convert current date and time to CST timezone
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset() - 6*60);
  
    // Create date for September 6th, 2023, 11AM CST
    let releaseDate = new Date(Date.UTC(2023, 8, 6, 16, 0, 0));
  
    // Calculate difference in milliseconds
    let difference = releaseDate - now;
  
    // Calculate difference in days
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  
    // Calculate difference in hours left over
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    // Return a human-readable string
    if (days > 0 || hours > 0) {
      return "There is " + days + " days and " + hours + " hours till the release of Starfield.";
    } else if (now > releaseDate) {
      return "Starfield has been released.";
    } else {
      return "Starfield is being released right now!";
    }
}
  