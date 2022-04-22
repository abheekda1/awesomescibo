import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import log from '../helpers/log.js';

export const data = new SlashCommandBuilder()
	.setName('settings')
	.setDescription('BETA - settings configuration')
	.addSubcommand(subcommand => {
		subcommand
			.setName('subject')
			.setDescription('Changes subject of problems');
		return subcommand;
	})
	.addSubcommand(subcommand => {
		subcommand
			.setName('display')
			.setDescription('Displays current settings');
		return subcommand;
	})
	.addSubcommand(subcommand => {
		subcommand
			.setName('gradelevels')
			.setDescription('Changes grade level of problems');
		return subcommand;
	})
;

export async function execute(interaction : CommandInteraction) {
	const action = interaction.options.getSubcommand();
	switch (action) {
	case 'display': {
		await interaction.deferReply();
		const settingsEmbed = new MessageEmbed()
			.setColor('#ffffff');

		const user = interaction.options.getUser('user') || interaction.user;

		const client = interaction.client;

		settingsEmbed
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setDescription('Current selections: ');
		const menu = new MessageActionRow()
			.addComponents(
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
					]),
			);

		let dispMsg = interaction.followUp({
			embeds: [settingsEmbed],
			components: [menu],
		})
			.then((dispMsg => {
				const w = dispMsg as Message;
				let h;
				const dispFilter = i => ['selectdisp'].includes(i.customId) && i.user.id == interaction.user.id; // <== ATTENTION! First argument...
				w.awaitMessageComponent({ filter: dispFilter, componentType: 'SELECT_MENU' })
					.then(dispChoice => {
						h = dispChoice.values;
						if (h == 'subjects') {
							interaction.editReply({ content: 'Level set to: Middle School', components: [] });
						}
						else if (h == 'gradelevels') {
							interaction.editReply({ content: 'Level set to: High School', components: [] });
						}
						else{
							err => log({ logger: '\'Error occurred: /settings:display did not equal subjects or gradelevels.\'', content: `${err}`, level: 'error' })
						}
					})
			}));
		break;
	}
	case 'gradelevels': {
		await interaction.deferReply();

		const settingsEmbed = new MessageEmbed()
			.setColor('#ffffff');

		const user = interaction.options.getUser('user') || interaction.user;

		const client = interaction.client;

		settingsEmbed
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setDescription('Current level settings: ');
		const menu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('selectlvl')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(2)
					.addOptions([
						{
							label: 'Middle School',
							description: 'Middle school level problems',
							value: 'ms',
						},
						{
							label: 'High School',
							description: 'High school level problems',
							value: 'hs',
						},
					]),
			);

		let lvlMsg = interaction.followUp({
			embeds: [settingsEmbed],
			components: [menu],
		})
			.then((lvlMsg => {
				const w = lvlMsg as Message;
				let h;
				const lvlFilter = i => ['selectlvl'].includes(i.customId) && i.user.id == interaction.user.id; // <== ATTENTION! First argument...
				w.awaitMessageComponent({ filter: lvlFilter, componentType: 'SELECT_MENU' })
					.then(lvlChoice => {
						h = lvlChoice.values;
						if (h == 'ms') {
							interaction.editReply({ content: 'Level set to: Middle School', components: [] });
						}
						else if (h == 'hs') {
							interaction.editReply({ content: 'Level set to: High School', components: [] });
						}
						else {
							interaction.editReply({ content: 'Level set to: All', components: [] });
						}
					})
			}));
			break;
	}
	case 'subject': {
		await interaction.deferReply();

		const settingsEmbed = new MessageEmbed()
			.setColor('#ffffff');

		const user = interaction.options.getUser('user') || interaction.user;

		const client = interaction.client;

		settingsEmbed
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setDescription('Current subject settings: ');
		const menu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('selectsubject')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(7)
					.addOptions([
						{
							label: 'Astronomy',
							description: 'Astronomy',
							value: 'astro',
						},
						{
							label: 'Biology',
							description: 'Biology',
							value: 'bio',
						},
						{
							label: 'Earth Science',
							description: 'Earth Science',
							value: 'es',
						},
						{
							label: 'Chemistry',
							description: 'Chemistry',
							value: 'chem',
						},
						{
							label: 'Physics',
							description: 'Physics',
							value: 'phy',
						},
						{
							label: 'Mathematics',
							description: 'Mathematics',
							value: 'math',
						},
						{
							label: 'Energy',
							description: 'Energy',
							value: 'energy',
						},
					]),
			);

		let subjectMsg = interaction.followUp({
			embeds: [settingsEmbed],
			components: [menu],
		})
			.then((subjectMsg => {
				const w = subjectMsg as Message;
				let h;
				const subjectFilter = i => ['selectsubject'].includes(i.customId) && i.user.id == interaction.user.id; // <== ATTENTION! First argument...
				w.awaitMessageComponent({ filter: subjectFilter, componentType: 'SELECT_MENU' })
					.then(subjectChoice => {
						let sendstring = 'Subjects set to: ';
						h = subjectChoice.values;
						if (h.includes('astro')) {
							// astro processing code here
							sendstring = sendstring + 'Astronomy, ';
						}
						if (h.includes('bio')) {
							// bio processing code here
							sendstring = sendstring + 'Biology, ';
						}
						if (h.includes('es')){
							// earth science processing code here
							sendstring = sendstring + 'Earth Science, ';
						}
						if (h.includes('chem')){
							// chemistry processing code here
							sendstring = sendstring + 'Chemistry, ';
						}
						if (h.includes('phy')){
							// physics processing code here
							sendstring = sendstring + 'Physics, ';
						}
						if (h.includes('math')){
							// math processing code here
							sendstring = sendstring + 'Math, ';
						}
						if (h.includes('energy')){
							// energy processing code here
							sendstring = sendstring + 'Energy, ';
						}
						sendstring = sendstring.slice(0, -2);
						interaction.editReply({ content: sendstring, components: [] });
					})
			}));
		break;
	}
	}
}