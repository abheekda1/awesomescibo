#!/usr/bin/env node

require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
const axios = require('axios');
const mongoose = require('mongoose');
const gitlog = require('gitlog').default;
const decode = require('html-entities').decode;

const userScore = require('./models/userScore');
const generatedRound = require('./models/generateRound');

const helpMessage = 'AwesomeSciBo has migrated to using slash commands! You can take a look at the different commands by typing `/` and clicking on the AwesomeSciBo icon.';
const slashCommands = require('./slashCommands.json');
const config = {
	topggauth: process.env['TOPGGAUTH'],
};

client.once('ready', () => {
	client.application.commands.set(slashCommands);

	// Connect to MongoDB using mongoose
	if (!process.env.CI) {
		mongoose
			.connect(process.env.MONGO_URI, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			})
			.then(() => {
				// Log client tag and set status
				console.log(`Logged in as: ${client.user.username}!`);
				client.user.setActivity(
					'for /help',
					{ type: 'WATCHING' },
				);
			})
			.catch((err) => console.log(err));
	}
});

client.on('guildCreate', () => {
	const topggAuthHeader = {
		headers: {
			'Authorization': config.topggauth,
		},
	};
	axios.post(`https://top.gg/api/bots/${client.user.id}/stats`, { server_count: client.guilds.cache.size }, topggAuthHeader).then(response => { console.log(response); });
});

client.on('guildDelete', () => {
	const topggAuthHeader = {
		headers: {
			'Authorization': config.topggauth,
		},
	};
	axios.post(`https://top.gg/api/bots/${client.user.id}/stats`, { server_count: client.guilds.cache.size }, topggAuthHeader);
});

async function updateScore(isCorrect, score, authorId) {
	if (!isCorrect) {
		return `Nice try! Your score is still ${score}.`;
	}
	else {
		score += 4;
		if (score == 4) {
			const newUserScore = new userScore({
				authorID: authorId,
				score: score,
			});
			newUserScore.save((err) =>
				err
					? console.log('Error creating new user for scoring')
					: console.log('Sucessfully created user to score.'),
			);
		}
		else {
			const doc = await userScore.findOne({
				authorID: authorId,
			});
			doc.score = doc.score + 4;
			doc.save();
		}

		return `Great job! Your score is now ${score}.`;
	}
}

async function training(subject, interaction) {
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
			new Discord.MessageEmbed()
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
								const overrideEmbed = new Discord.MessageEmbed()
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
}

function sendHelpMessage(interaction) {
	const helpEmbed = new Discord.MessageEmbed().setDescription(helpMessage).setColor('ffffff');
	interaction.reply({ embeds: [helpEmbed] });
}

function showLeaderboard(interaction) {
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
			const leaderboardEmbed = new Discord.MessageEmbed()
				.setTitle('Top Ten!')
				.setDescription(messageContent)
				.setColor('#ffffff');

			interaction.reply({ embeds: [leaderboardEmbed] });
		});
}

async function about(action, interaction) {
	if (action === 'contributors') {
		const contributorEmbed = new Discord.MessageEmbed().setTitle('Contributors')
			.addField('Creator', '<@745063586422063214> [ADawesomeguy#3602]', true)
			.addField('Contributors', '<@650525101048987649> [tEjAs#8127]\n<@426864344463048705> [tetrident#9396]', true) // Add more contributors here, first one is Abheek, second one is Tejas
			.setTimestamp()
			.setColor('#ffffff');

		interaction.reply({ embeds: [contributorEmbed] });
	}
	else if (action === 'changelog') {
		const gitRepoLocation = __dirname;

		const commits = gitlog({
			repo: gitRepoLocation,
			number: 5,
			fields: ['hash', 'abbrevHash', 'subject', 'authorName', 'authorDateRel'],
		});

		const changelogEmbed = new Discord.MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Changelog')
			.setColor('#ffffff')
			.setTimestamp();

		commits.forEach(commit => {
			changelogEmbed.addField(commit.abbrevHash, `> \`Hash:\`${commit.hash}\n> \`Subject:\`${commit.subject}\n> \`Author:\`${commit.authorName}\n> \`Date:\`${commit.authorDateRel}\n> \`Link\`: [GitHub](https://github.com/ADawesomeguy/AwesomeSciBo/commit/${commit.hash})\n`);
		});

		interaction.reply({ embeds: [changelogEmbed] });
	}
	else if (action === 'bot') {
		await client.guilds.fetch();
		const trainingDocuments = await userScore.countDocuments({});
		const aboutBotEmbed = new Discord.MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('About AwesomeSciBo')
			.addField('Servers', `${client.guilds.cache.size}`, true)
			.addField('Training Users', `${trainingDocuments}`, true)
			.setTimestamp();

		interaction.reply({ embeds: [aboutBotEmbed] });
	}
}

async function rounds(action, interaction) {
	if (action === 'generate') {
		let i;
		let finalizedHTML = '<html><head><link rel=\'preconnect\' href=\'https://fonts.gstatic.com\'><link href=\'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap\' rel=\'stylesheet\'> </head><body style=\'width: 70%; margin-left: auto; margin-right: auto;\'><h2 style=\'text-align: center; text-decoration: underline overline; padding: 7px;\'>ROUND GENERATED BY AWESOMESCIBO USING THE SCIBOWLDB API</h2>';
		let tossup_question;
		let question_category;
		let tossup_format;
		let tossup_answer;
		let bonus_question;
		let bonus_format;
		let bonus_answer;
		let htmlContent = '';
		await axios.post('https://scibowldb.com/api/questions', { categories: ['BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'EARTH AND SPACE', 'ASTRONOMY', 'MATH'] })
			.then((response) => {
				for (i = 1; i < 26; i++) {
					const data = response.data.questions[Math.floor(Math.random() * response.data.questions.length)];
					tossup_question = data.tossup_question;
					tossup_answer = data.tossup_answer;
					question_category = data.category;
					tossup_format = data.tossup_format;
					bonus_question = data.bonus_question;
					bonus_answer = data.bonus_answer;
					bonus_format = data.bonus_format;
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
						console.log(err);
						return;
					}
					interaction.reply(`Here's your round: https://api.adawesome.tech/round/${round._id.toString()}`, { ephemeral: true });
				});
			});
	}
	else if (action === 'list') {
		let roundsList = await generatedRound.find({ requestedBy: interaction.user.id }).sort({ timestamp: -1 });
		let finalMessage = '';
		if (!roundsList) {
			interaction.reply('You haven\'t requested any roundsList!');
			return;
		}

		if (roundsList.length > 5) {
			roundsList = roundsList.slice(0, 5);
		}

		roundsList.forEach(async (item, index) => {
			finalMessage += `${index + 1}. [${item.timestamp.split('T')[0]}](https://api.adawesome.tech/round/${item._id.toString()})\n`;
		});

		const roundsListEmbed = new Discord.MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`Last 5 roundsList requested by ${interaction.user.tag}`)
			.setDescription(finalMessage)
			.setTimestamp();

		interaction.reply({
			embeds: [roundsListEmbed],
			ephemeral: true,
		});
	}
	else if (action === 'hit') {
		const totalCount = await generatedRound.countDocuments({});
		const userCount = await generatedRound.countDocuments({ requestedBy: interaction.user.id });

		interaction.reply(`Total Hits: ${totalCount}\nYour Hits: ${userCount}`);
	}
}

async function result(interaction) {
	if (interaction.channel.id !== '930275699644825600') {
		return interaction.reply({ content: 'This command is unavailable outside of the designated channel.', ephemeral: true });
	}
	const resultEmbed = new Discord.MessageEmbed();
	resultEmbed.setTitle(`${interaction.options.get('location').value} Regionals`);
	resultEmbed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
	resultEmbed.addField('<a:winner:932137838592552960> Winner', `Congratulations to **${interaction.options.get('winner').value}**!`);
	if (interaction.options.get('runner-up')) resultEmbed.addField('<:second:932138645601800252> Runners-Up', interaction.options.get('runner-up').value);
	if (interaction.options.get('third-place')) resultEmbed.addField('<:third:932138645526315080> Third Place', interaction.options.get('third-place').value);
	if (interaction.options.get('honorable-mentions')) resultEmbed.addField('🎖️ Honorable Mentions', interaction.options.get('honorable-mentions').value);
	resultEmbed.setColor('#FFFFFF');
	resultEmbed.setTimestamp();

	await interaction.reply({ embeds: [resultEmbed] });
}

client.on('interactionCreate', async interaction => {
	// If the interaction isn't a slash command, return
	if (!interaction.isCommand()) return;

	switch (interaction.commandName) {
	case 'help':
		sendHelpMessage(interaction);
		break;
	case 'train':
		training(interaction.options.get('subject') ? interaction.options.get('subject').value : null, interaction);
		break;
	case 'roundsList':
		rounds(interaction.options.getSubcommand(), interaction);
		break;
	case 'top':
		showLeaderboard(interaction);
		break;
	case 'about':
		about(interaction.options.getSubcommand(), interaction);
		break;
	case 'result':
		result(interaction);
	}
});

client
	.login(process.env.TOKEN)
	.then(() => console.log('Running!'))
	.catch((error) => console.log(error));
