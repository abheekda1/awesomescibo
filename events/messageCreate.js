const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const decode = require('html-entities').decode;

const { testingGuild } = require('../helpers/env');
module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		if (message.author.bot || message.guild.id != testingGuild) return;

		if (message.content.startsWith('!q')) {
			const questionId = message.content.split(' ')[1];
			axios
				.get(`https://scibowldb.com/api/questions/${questionId}`)
				.then((res) => {
					const data = res.data.question;
					const tossupQuestion = data.tossup_question;
					const tossupAnswer = data.tossup_answer;
					const answers = tossupAnswer.split(' (ACCEPT: ');
					if (answers.length > 1) {
						answers[1] = answers[1].slice(0, answers[1].length - 1); // If there are multiple elements, it means there was an 'accept' and therefore a trailing ')' which should be removed
						answers[1] = answers[1].split(new RegExp(' OR ', 'i')); // Ignore case using the 'i' flag in regex
					}
					const dataEmbed = new MessageEmbed()
						.setTitle('Data')
						.setDescription(`\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``);
					message.reply({
						content: decode(tossupQuestion) + `\n\nAnswers: [${answers}]`,
						embeds: [dataEmbed],
					});
				});
		}
	},
};
