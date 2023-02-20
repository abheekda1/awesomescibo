import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import log from '../helpers/log';
import userScore from '../models/userScore';

export const data = new SlashCommandBuilder()
	.setName('score')
	.setDescription('Returns the score of the current user or another')
	.addUserOption((option) => {
		option
			.setName('user')
			.setDescription('The user to find the score for')
			.setRequired(false);

		return option;
	});

export async function execute(interaction: CommandInteraction) {
	const scoreEmbed = new MessageEmbed().setColor('#ffffff');

	const user = interaction.options.getUser('user') || interaction.user;
	userScore.findOne({ authorID: user.id }, async (err, score) => {
		if (err) {
			log({
				logger: 'db',
				content: `Unable to obtain user: ${err}`,
				level: 'info',
			});
		}

		if (!score) {
			await interaction.reply({
				content:
					'Unfortunately, that user does not seem to have used AwesomeSciBo yet.',
				ephemeral: true,
			});
			return;
		}

		scoreEmbed
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setDescription(`Score: \`${score.score}\``);

		await interaction.reply({ embeds: [scoreEmbed] });
	});
}
