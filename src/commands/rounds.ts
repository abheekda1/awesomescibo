import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, CommandInteraction } from 'discord.js';

import axios from 'axios';

import log from '../helpers/log';
import generatedRound from '../models/generatedRound';

export const data = new SlashCommandBuilder()
	.setName('rounds')
	.setDescription('Commands regarding the generation of rounds')
	.addSubcommand(subcommand => {
		subcommand
			.setName('generate')
			.setDescription('Generates a round with randomized questions from https://scibowldb.com/');
		return subcommand;
	})
	.addSubcommand(subcommand => {
		subcommand
			.setName('list')
			.setDescription('Lists your 5 most recently generated rounds with links');
		return subcommand;
	})
	.addSubcommand(subcommand => {
		subcommand
			.setName('hit')
			.setDescription('Shows the total number of rounds hit as well as the number for the specific user');
		return subcommand;
	});

export async function execute(interaction: CommandInteraction) {
	const action = interaction.options.getSubcommand();
	switch (action) {
	case 'generate': {
		interaction.deferReply({ ephemeral: true });

		let finalizedHTML = '<html><head><link rel=\'preconnect\' href=\'https://fonts.gstatic.com\'><link href=\'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap\' rel=\'stylesheet\'> </head><body style=\'width: 70%; margin-left: auto; margin-right: auto;\'><h2 style=\'text-align: center; text-decoration: underline overline; padding: 7px;\'>ROUND GENERATED BY AWESOMESCIBO USING THE SCIBOWLDB API</h2>';
		let tossup_question: string;
		let question_category: string;
		let tossup_format: string;
		let tossup_answer: string;
		let bonus_question: string;
		let bonus_format: string;
		let bonus_answer: string;
		let htmlContent = '';
		await axios.post('https://scibowldb.com/api/questions', { categories: ['BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'EARTH AND SPACE', 'ASTRONOMY', 'MATH'] })
			.then((response) => {
				for (let i = 1; i < 26; i++) {
					const questionData = response.data.questions[Math.floor(Math.random() * response.data.questions.length)];
					tossup_question = questionData.tossup_question;
					tossup_answer = questionData.tossup_answer;
					question_category = questionData.category;
					tossup_format = questionData.tossup_format;
					bonus_question = questionData.bonus_question;
					bonus_answer = questionData.bonus_answer;
					bonus_format = questionData.bonus_format;
					htmlContent = '<br><br><h3 style=\'text-align: center;\'><strong>TOSS-UP</strong></h3>\n<br>' + `${i}) <strong>${question_category}</strong>` + ' ' + `<em>${tossup_format}</em>` + ' ' + tossup_question + '<br><br>' + '<strong>ANSWER:</strong> ' + tossup_answer + '<br>';
					htmlContent += '<br><br><h3 style=\'text-align: center;\'><strong>BONUS</strong></h3>\n<br>' + `${i}) <strong>${question_category}</strong>` + ' ' + `<em>${bonus_format}</em>` + ' ' + bonus_question + '<br><br>' + '<strong>ANSWER:</strong> ' + bonus_answer + '<br><br><hr><br>';
					htmlContent = htmlContent.replace(/\n/g, '<br>');
					finalizedHTML += htmlContent;
				}

				const newGeneratedRound = new generatedRound({
					htmlContent: finalizedHTML,
					requestedBy: interaction.user.id,
					authorTag: interaction.user.tag,
					timestamp: new Date().toISOString(),
				});

				newGeneratedRound.save((err, round) => {
					if (err) {
						log({ logger: 'rounds', content: `Saving round to DB failed: ${err}`, level: 'error' });
						return;
					}
					interaction.followUp({
						content: `Here's your round: https://api.adawesome.tech/round/${round._id.toString()}`,
						ephemeral: true,
					});
				});
			});
		break;
	}

	case 'list': {
		interaction.deferReply({ ephemeral: true });

		let roundsList = await generatedRound.find({ requestedBy: interaction.user.id }).sort({ timestamp: -1 });
		let finalMessage = '';
		if (!roundsList) {
			interaction.followUp('You haven\'t requested any rounds!');
			return;
		}

		if (roundsList.length > 5) {
			roundsList = roundsList.slice(0, 5);
		}

		roundsList.forEach(async (item, index) => {
			finalMessage += `${index + 1}. [${item.timestamp.split('T')[0]}](https://api.adawesome.tech/round/${item._id.toString()})\n`;
		});

		const roundsListEmbed = new MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Last 5 rounds requested')
			.setDescription(finalMessage)
			.setTimestamp();

		interaction.followUp({
			embeds: [roundsListEmbed],
			ephemeral: true,
		});
		break;
	}

	case 'hit': {
		await interaction.deferReply();

		const totalCount = await generatedRound.countDocuments({});
		const userCount = await generatedRound.countDocuments({ requestedBy: interaction.user.id });

		interaction.followUp(`Total Hits: ${totalCount}\nYour Hits: ${userCount}`);
		break;
	}
	}
}