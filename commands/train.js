const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const decode = require('html-entities').decode;
const axios = require('axios');

const userScore = require('../models/userScore');

const { updateScore } = require('../helpers/db.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('train')
		.setDescription('Sends a training question to be answered')
		.addStringOption(option => {
			option
				.setName('subject')
				.setDescription('Optional subject to be used as a filter')
				.setRequired(false)
				.addChoice('astro', 'astro')
				.addChoice('bio', 'bio')
				.addChoice('ess', 'ess')
				.addChoice('chem', 'chem')
				.addChoice('phys', 'phys')
				.addChoice('math', 'math')
				.addChoice('energy', 'energy')
				.setRequired(false);
			return option;
		}),
	async execute(interaction) {
		const subject = interaction.options.get('subject') ? interaction.options.get('subject').value : null;
		const authorId = interaction.user.id;
		let score;
		userScore
			.findOne({ authorID: authorId })
			.lean()
			.then((obj, err) => {
				if (!obj) {
					score = 0;
				}
				else if (obj) {
					score = obj.score;
				}
				else {
					console.log(err);
				}
			});

		let categoryArray = [];

		switch (subject) {
		case null:
			categoryArray = ['BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'EARTH AND SPACE', 'ASTRONOMY', 'MATH'];
			break;
		case 'astro':
		case 'astronomy':
			categoryArray = ['ASTRONOMY'];
			break;
		case 'bio':
		case 'biology':
			categoryArray = ['BIOLOGY'];
			break;
		case 'ess':
		case 'earth science':
		case 'es':
			categoryArray = ['EARTH SCIENCE'];
			break;
		case 'chem':
		case 'chemistry':
			categoryArray = ['CHEMISTRY'];
			break;
		case 'phys':
		case 'physics':
			categoryArray = ['PHYSICS'];
			break;
		case 'math':
			categoryArray = ['MATH'];
			break;
		case 'energy':
			categoryArray = ['ENERGY'];
			break;
		default:
			interaction.reply(
				new MessageEmbed()
					.setDescription('<:red_x:816791117671825409> Not a valid subject!')
					.setColor('#ffffff'),
			);
			return;
		}

		axios
			.post('https://scibowldb.com/api/questions/random', { categories: categoryArray })
			.then((res) => {
				const data = res.data.question;
				const tossupQuestion = data.tossup_question;
				const tossupAnswer = data.tossup_answer;
				const messageFilter = message => message.author.id === interaction.author.id;
				interaction.reply({ content: decode(tossupQuestion) + `\n\n||Source: ${data.uri}||` })
					.then(() => {
						interaction.channel.awaitMessages({
							messageFilter,
							max: 1,
						})
							.then(collected => {
								console.log(collected.first());
								const answerMsg = collected.first();

								let predicted = null;
								if (data.tossup_format === 'Multiple Choice') {
									if (
										answerMsg.content.charAt(0).toLowerCase() ===
							tossupAnswer.charAt(0).toLowerCase()
									) {
										predicted = 'correct';
									}
									else {
										predicted = 'incorrect';
									}
								}
								else if (
									answerMsg.content.toLowerCase() ===
							tossupAnswer.toLowerCase()
								) {
									predicted = 'correct';
								}
								else {
									predicted = 'incorrect';
								}

								if (predicted === 'correct') {
									updateScore(true, score, authorId).then((msgToReply) =>
										answerMsg.reply(msgToReply),
									);
								}
								else {
									const overrideEmbed = new MessageEmbed()
										.setAuthor({ name: answerMsg.author.tag, iconURL: answerMsg.author.displayAvatarURL() })
										.addField('Correct answer', `\`${tossupAnswer}\``)
										.setDescription('It seems your answer was incorrect. Please react with <:override:842778128966615060> to override your answer if you think you got it right.')
										.setColor('#ffffff')
										.setTimestamp();
									answerMsg.channel.send({
										embeds: [overrideEmbed],
									})
										.then(overrideMsg => {
											overrideMsg.react('<:override:842778128966615060>');
											const filter = (reaction, user) => {
												return (
													['override'].includes(reaction.emoji.name) &&
									user.id === answerMsg.author.id
												);
											};
											overrideMsg
												.awaitReactions({
													filter,
													max: 1,
												})
												.then(() => {
													updateScore(true, score, authorId).then((msgToReply) =>
														answerMsg.reply(msgToReply),
													);
												}).catch(console.error);
										}).catch(console.error);
								}
							}).catch(console.error);
					}).catch(console.error);
			}).catch(console.error);
	},
};
