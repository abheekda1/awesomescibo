import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';

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
					.setCustomId('select')
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

		await interaction.followUp({ embeds: [settingsEmbed], components: [menu] });

		client.on('interactionCreate', async interaction => {
			if (!interaction.isSelectMenu()) return;
			const values = interaction.values[0];
			switch (values) {
			case 'subjects':
				await interaction.update({ content: 'subjects was selected!', components: [] });
				break;
			case 'gradelevels':
				await interaction.update({ content: 'levels was selected!', components: [] });
				break;
			}
		});
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
						console.log(h);
						if (h == 'ms') {
							console.log('ms');
							interaction.editReply({ content: 'Level set to: Middle School', components: [] });
						}
						else if (h == 'hs' ) {
							console.log('hs');
							interaction.editReply({ content: 'Level set to: High School', components: [] });
						}
						else {
							console.log('both');
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
					.setCustomId('select')
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

		await interaction.followUp({ embeds: [settingsEmbed], components: [menu] });

		client.on('interactionCreate', async interaction => {
			if (!interaction.isSelectMenu()) return;
			const values = interaction.values[0];
			switch (values) {
			case 'astro':
				// astronomy stuff
				await interaction.update({ content: 'Subject set to: Astronomy', components: [] });
				break;
			case 'bio':
				// biology stuff
				await interaction.update({ content: 'Subject set to: Biology', components: [] });
				break;
			case 'es':
				// earth science stuff
				await interaction.update({ content: 'Subject set to: Earth Science', components: [] });
				break;
			case 'chem':
				// chemistry stuff
				await interaction.update({ content: 'Subject set to: Chemistry', components: [] });
				break;
			case 'phy':
				// physics stuff
				await interaction.update({ content: 'Subject set to: Physics', components: [] });
				break;
			case 'math':
				// math stuff
				await interaction.update({ content: 'Subject set to: Mathematics', components: [] });
				break;
			case 'energy':
				// the united states department of energy is a cabinet-level agency responsible for the creation and management of...
				await interaction.update({ content: 'Subject set to: Energy', components: [] });
				break;
			}
		});
		break;
	}
	}
}