import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, CommandInteraction } from 'discord.js';

import gitlog from 'gitlog';

import userScore from '../models/userScore';

import { paginateInteraction } from '../helpers/util/pagination';

export const data = new SlashCommandBuilder()
	.setName('about')
	.setDescription('Commands regarding the creation/development of the bot');

export async function execute(interaction: CommandInteraction) {
	await interaction.deferReply();

	const client = interaction.client;
	const embeds: MessageEmbed[] = [];

	const contributorEmbed = new MessageEmbed()
		.setTitle('Contributors')
		.addField('Creator', '<@745063586422063214> [ADawesomeguy#3602]', true)
		.addField(
			'Contributors',
			'<@650525101048987649> [tEjAs#8127]\n<@426864344463048705> [tetrident#9396]',
			true
		) // Add more contributors here, first one is Abheek, second one is Tejas
		.setTimestamp()
		.setColor('#ffffff');
	embeds.push(contributorEmbed);

	const gitRepoLocation = __dirname;

	const commits = gitlog({
		repo: gitRepoLocation,
		number: 5,
		fields: ['hash', 'abbrevHash', 'subject', 'authorName', 'authorDateRel'],
	});

	const changelogEmbed = new MessageEmbed()
		.setAuthor({
			name: interaction.user.tag,
			iconURL: interaction.user.displayAvatarURL(),
		})
		.setTitle('Changelog')
		.setColor('#ffffff')
		.setTimestamp();

	commits.forEach((commit) => {
		changelogEmbed.addField(
			commit.abbrevHash,
			`> \`Hash:\`${commit.hash}\n> \`Subject:\`${commit.subject}\n> \`Author:\`${commit.authorName}\n> \`Date:\`${commit.authorDateRel}\n> \`Link\`: [GitHub](https://github.com/ADawesomeguy/AwesomeSciBo/commit/${commit.hash})\n`
		);
	});
	embeds.push(changelogEmbed);

	await client.guilds.fetch();
	const trainingDocuments = await userScore.countDocuments({});
	const aboutBotEmbed = new MessageEmbed()
		.setAuthor({
			name: interaction.user.tag,
			iconURL: interaction.user.displayAvatarURL(),
		})
		.setTitle('About AwesomeSciBo')
		.addField('Servers', `${client.guilds.cache.size}`, true)
		.addField('Training Users', `${trainingDocuments}`, true)
		.setTimestamp();

	embeds.push(aboutBotEmbed);

	paginateInteraction(interaction, embeds);
}
