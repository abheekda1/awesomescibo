import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { decode } from 'html-entities';

import { testingGuild } from '../helpers/env';

export const name = 'messageCreate';

export const once = false;

export async function execute(message) {
	if (message.author.bot || message.guild.id != testingGuild) return;

	if (message.content.startsWith('!q')) {
		const questionId = message.content.split(' ')[1];
		axios
			.get(`https://scibowldb.com/api/questions/${questionId}`)
			.then((res) => {
				const data = res.data.question;
				const tossupQuestion = data.tossup_question;
				const tossupAnswer = data.tossup_answer;
				let answers = tossupAnswer.split(' (ACCEPT: ');
				if (answers.length > 1) {
					answers[1] = answers[1].slice(0, answers[1].length - 1); // If there are multiple elements, it means there was an 'accept' and therefore a trailing ')' which should be removed
					answers = [answers[0], ...answers[1].split(new RegExp(' OR ', 'i'))]; // Use the first element plus the last element split by 'OR' case insensitive
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
}