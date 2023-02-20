import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import log from '../helpers/log';
import userScore from '../models/userScore';

export const data = new SlashCommandBuilder()
	.setName('top')
	.setDescription(
		'Lists top ten scores across servers and in the current server'
	);

export async function execute(interaction: CommandInteraction) {
	await interaction.deferReply();

	userScore
		.find({})
		.sort({ score: -1 }) // Sort by descending order
		.exec(async (err, obj) => {
			if (err) {
				log({
					logger: 'top',
					content: `Getting top players failed: ${err}`,
					level: 'error',
				});
				console.log(err);
			}

			if (obj.length < 10) {
				// Need at least 10 scores for top 10
				return interaction.followUp(
					`There are only ${obj.length} users, we need at least 10!`
				);
			}

			const embeds: MessageEmbed[] = [];
			let lbMessageContent = '';

			for (let i = 0; i < 10; i++) {
				lbMessageContent += `${i + 1}: <@${obj[i].authorID}>: ${
					obj[i].score
				}\n`; // Loop through each user and add their name and score to leaderboard content
			}

			const leaderboardEmbed = new MessageEmbed()
				.setTitle('Top Ten!')
				.setDescription(lbMessageContent)
				.setColor('#ffffff');

			embeds.push(leaderboardEmbed);

			let sMessageContent = '';
			const members = await interaction.guild?.members.fetch();

			const serverLeaderBoardArray = await obj.filter((o) =>
				members?.some((m) => m.user.id === o.authorID)
			);
			if (serverLeaderBoardArray.length > 10) {
				for (let i = 0; i < 10; i++) {
					sMessageContent += `${i + 1}: <@${
						serverLeaderBoardArray[i].authorID
					}>: ${serverLeaderBoardArray[i].score}\n`;
				}

				const sLeaderboardEmbed = new MessageEmbed()
					.setTitle(`Top Ten in ${interaction.guild?.name}!`)
					.setDescription(sMessageContent)
					.setColor('#ffffff');

				embeds.push(sLeaderboardEmbed);
			}

			interaction.followUp({ embeds: embeds });
		});
}
