const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with a help message explaining what the bot can do'),
	async execute(interaction) {
		await interaction.deferReply();

		const helpEmbed = new MessageEmbed()
			.setDescription('AwesomeSciBo has migrated to using slash commands! You can take a look at the different commands by typing `/` and clicking on the AwesomeSciBo icon.')
			.setColor('#ffffff');
		interaction.followUp({ embeds: [helpEmbed] });
	},
};
