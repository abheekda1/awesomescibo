const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const gitlog = require('gitlog').default;

const userScore = require('../models/userScore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Commands regarding the creation/development of the bot')
		.addSubcommand(subcommand => {
			subcommand
				.setName('contributors')
				.setDescription('Lists contributors to the AwesomeSciBo bot');
			return subcommand;
		})
		.addSubcommand(subcommand => {
			subcommand
				.setName('changelog')
				.setDescription('Lists the 5 most recent changes in a "git log" type format');
			return subcommand;
		})
		.addSubcommand(subcommand => {
			subcommand
				.setName('bot')
				.setDescription('Lists information about AwesomeSciBo');
			return subcommand;
		}),
	async execute(interaction) {
		const client = interaction.client;
		const action = interaction.options.getSubcommand();
		if (action === 'contributors') {
			const contributorEmbed = new MessageEmbed().setTitle('Contributors')
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

			const changelogEmbed = new MessageEmbed()
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
			const aboutBotEmbed = new MessageEmbed()
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
				.setTitle('About AwesomeSciBo')
				.addField('Servers', `${client.guilds.cache.size}`, true)
				.addField('Training Users', `${trainingDocuments}`, true)
				.setTimestamp();

			interaction.reply({ embeds: [aboutBotEmbed] });
		}
	},
};
