import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import log from '../helpers/log';
import userConfig from '../models/userConfig';

export const data = new SlashCommandBuilder()
	.setName('settings')
	.setDescription('BETA - settings configuration')
	.addSubcommand((subcommand) => {
		subcommand.setName('subject').setDescription('Changes subject of problems');
		return subcommand;
	})
	.addSubcommand((subcommand) => {
		subcommand.setName('display').setDescription('Displays current settings');
		return subcommand;
	})
	.addSubcommand((subcommand) => {
		subcommand
			.setName('gradelevels')
			.setDescription('Changes grade level of problems');
		return subcommand;
	});

export async function execute(interaction: CommandInteraction) {
	const action = interaction.options.getSubcommand();
	switch (action) {
		case 'display': {
			await interaction.deferReply();
			const settingsEmbed = new MessageEmbed().setColor('#ffffff');

			const user = interaction.options.getUser('user') || interaction.user;

			settingsEmbed
				.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
				.setDescription('Current selections: ');
			const menu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('selectdisp')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'subjects',
							description: 'subjects',
							value: 'subjects',
						},
						{
							label: 'gradelevels',
							description: 'grade levels',
							value: 'gradelevels',
						},
					])
			);

			interaction
				.followUp({
					embeds: [
						/* settingsEmbed*/
					],
					components: [menu],
				})
				.then((dispMsg) => {
					const w = dispMsg as Message;
					const dispFilter = (i) =>
						['selectdisp'].includes(i.customId) &&
						i.user.id == interaction.user.id; // <== ATTENTION! First argument...
					w.awaitMessageComponent({
						filter: dispFilter,
						componentType: 'SELECT_MENU',
					}).then(async (dispChoice) => {
						const vals = dispChoice.values;
						const config = await userConfig.findById(interaction.user.id);
						if (!config) {
							await interaction.editReply({
								content: "You don't have a configuration!",
								embeds: [],
								components: [],
							});
						} else if (vals.length === 1 && vals.at(0) === 'subjects') {
							await interaction.editReply({
								content: `Current subjects setting: ${config.subjects
									.toString()
									.split(',')
									.join(', ')}`,
								components: [],
							});
						} else if (vals.length === 1 && vals.at(0) === 'gradelevels') {
							await interaction.editReply({
								content: `Current grade level setting: ${config.gradeLevels
									.toString()
									.split(',')
									.join(', ')}`,
								components: [],
							});
						} else {
							(err) =>
								log({
									logger:
										"'Error occurred: /settings:display did not equal subjects or gradelevels.'",
									content: `${err}`,
									level: 'error',
								});
						}
					});
				});
			break;
		}
		case 'gradelevels': {
			await interaction.deferReply();

			const settingsEmbed = new MessageEmbed().setColor('#ffffff');

			const user = interaction.options.getUser('user') || interaction.user;

			settingsEmbed
				.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
				.setDescription('Current level settings: ');
			const menu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('selectlvl')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(2)
					.addOptions([
						{
							label: 'Middle School',
							description: 'Middle school level problems',
							value: 'MS',
						},
						{
							label: 'High School',
							description: 'High school level problems',
							value: 'HS',
						},
					])
			);

			interaction
				.followUp({
					embeds: [
						/* settingsEmbed*/
					],
					components: [menu],
				})
				.then((lvlMsg) => {
					const w = lvlMsg as Message;
					const lvlFilter = (i) =>
						['selectlvl'].includes(i.customId) &&
						i.user.id == interaction.user.id; // <== ATTENTION! First argument...
					w.awaitMessageComponent({
						filter: lvlFilter,
						componentType: 'SELECT_MENU',
					}).then(async (lvlChoice) => {
						const vals = lvlChoice.values;
						const levels = new Array<string>();
						await userConfig.findOneAndUpdate(
							{ _id: interaction.user.id },
							{ gradeLevels: vals },
							{
								upsert: true,
								new: true,
							}
						);
						await vals.forEach((v) => {
							switch (v) {
								case 'MS':
									levels.push('Middle School');
									break;
								case 'HS':
									levels.push('High School');
							}
						});
						await interaction.editReply({
							content: `Level set to: ${levels
								.toString()
								.split(',')
								.join(', ')}`,
							embeds: [],
							components: [],
						});
					});
				});
			break;
		}
		case 'subject': {
			await interaction.deferReply();

			const settingsEmbed = new MessageEmbed().setColor('#ffffff');

			const user = interaction.options.getUser('user') || interaction.user;

			settingsEmbed
				.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
				.setDescription('Current subject settings: ');
			const menu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('selectsubject')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(7)
					.addOptions([
						{
							label: 'Astronomy',
							description: 'Astronomy',
							value: 'ASTRONOMY',
						},
						{
							label: 'Biology',
							description: 'Biology',
							value: 'BIOLOGY',
						},
						{
							label: 'Earth Science',
							description: 'Earth Science',
							value: 'EARTH SCIENCE',
						},
						{
							label: 'Chemistry',
							description: 'Chemistry',
							value: 'CHEMISTRY',
						},
						{
							label: 'Physics',
							description: 'Physics',
							value: 'PHYSICS',
						},
						{
							label: 'Mathematics',
							description: 'Mathematics',
							value: 'MATH',
						},
						{
							label: 'Energy',
							description: 'Energy',
							value: 'ENERGY',
						},
					])
			);

			interaction
				.followUp({
					embeds: [
						/* settingsEmbed*/
					],
					components: [menu],
				})
				.then((subjectMsg) => {
					const subjectFilter = (i) =>
						['selectsubject'].includes(i.customId) &&
						i.user.id == interaction.user.id; // <== ATTENTION! First argument...
					(subjectMsg as Message)
						.awaitMessageComponent({
							filter: subjectFilter,
							componentType: 'SELECT_MENU',
						})
						.then(async (subjectChoice) => {
							const vals = subjectChoice.values;
							await userConfig.findOneAndUpdate(
								{ _id: interaction.user.id },
								{ subjects: vals },
								{
									upsert: true,
									new: true,
								}
							);
							const subjects = new Array<string>();
							await vals.forEach((v) => {
								subjects.push(
									v
										.toLowerCase()
										.split(' ')
										.map((w) => w[0].toUpperCase() + w.substring(1))
										.join(' ')
								);
							});
							await interaction.editReply({
								content: `Subjects set to: ${subjects
									.toString()
									.split(',')
									.join(', ')}`,
								components: [],
								embeds: [],
							});
						});
				});
			break;
		}
	}
}
