import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import log from '../helpers/log';
import userScore from '../models/userScore';

export const data = new SlashCommandBuilder()
	.setName('top')
	.setDescription('Lists top ten scores across servers (server specific leaderboard WIP)');

export async function execute(interaction) {
	await interaction.deferReply();

	let messageContent = '';
	userScore
		.find({})
		.sort({ score: -1 }) // Sort by descending order
		.exec((err, obj) => {
			if (err) {
				log({ logger: 'top', content: `Getting top players failed: ${err}`, level: 'error' });
				console.log(err);
			}
			if (obj.length < 10) {
			// Need at least 10 scores for top 10
				return interaction.followUp(
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

			interaction.followUp({ embeds: [leaderboardEmbed] });
		});
}