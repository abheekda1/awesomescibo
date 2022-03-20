const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const userScore = require('../models/userScore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('top')
		.setDescription('Lists top ten scores across servers (server specific leaderboard WIP)'),
	async execute(interaction) {
		let messageContent = '';
		userScore
			.find({})
			.sort({ score: -1 }) // Sort by descending order
			.exec((err, obj) => {
				if (err) {
					console.log(err);
					return interaction.reply(
						'Uh oh! :( There was an internal error. Please try again.',
					);
				}
				if (obj.length < 10) {
				// Need at least 10 scores for top 10
					return interaction.reply(
						`There are only ${obj.length} users, we need at least 10!`,
					);
				}
				for (let i = 0; i < 10; i++) {
					messageContent += `${i + 1}: <@${obj[i].authorID}>: ${obj[i].score}\n`; // Loop through each user and add their name and score to leaderboard content
				}
				const leaderboardEmbed = new MessageEmbed()
					.setTitle('Top Ten!')
					.setDescription(messageContent)
					.setColor('#ffffff');

				interaction.reply({ embeds: [leaderboardEmbed] });
			});
	},
};
