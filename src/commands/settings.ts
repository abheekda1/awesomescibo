import { SlashCommandBuilder } from '@discordjs/builders';
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
import { CommandInteraction, MessageEmbed } from 'discord.js';

import log from '../helpers/log';

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
			.setName('gradeLevels')
			.setDescription('Changes grade level of problems');
		return subcommand;
	})
    .addSubcommand(subcommand => {
		subcommand
			.setName('display')
            .setDescription('Displays current settings');
		return subcommand;
	});

export async function execute(interaction : CommandInteraction) {
    const action = interaction.options.getSubcommand();
	switch (action) {
        case 'display': {
            await interaction.deferReply({ ephemeral: true }); 
            const settingsEmbed = new MessageEmbed()
                .setColor('#ffffff');

            const user = interaction.options.getUser('user') || interaction.user;
    
            const client = interaction.client;

            settingsEmbed
              .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`selections`);
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
                            label: 'gradeLevels',
                            description: 'grade levels',
                            value: 'gradeLevels',
                         },
                        ]),
                );

            await interaction.followUp({ embeds: [settingsEmbed], components: [menu] });
    
            client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            var values = interaction.values[0]; 
            switch(values)  {
                case 'subjects':
                    await interaction.update({ content: 'subjects was selected!', components: [] });
                    break;
                case 'gradeLevels':
                    await interaction.update({ content: 'levels was selected!', components: [] });
                    break;
                }
            });
            break;
        }
        case 'gradeLevels': {
            await interaction.deferReply({ ephemeral: true }); 
            const settingsEmbed = new MessageEmbed()
                .setColor('#ffffff');

            const user = interaction.options.getUser('user') || interaction.user;
    
            const client = interaction.client;

            settingsEmbed
              .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`selections`);
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
                            label: 'gradeLevels',
                            description: 'grade levels',
                            value: 'gradeLevels',
                         },
                        ]),
                );

            await interaction.followUp({ embeds: [settingsEmbed], components: [menu] });
    
            client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            var values = interaction.values[0]; 
            switch(values)  {
                case 'subjects':
                    await interaction.update({ content: 'subjects was selected!', components: [] });
                    break;
                case 'gradeLevels':
                    await interaction.update({ content: 'levels was selected!', components: [] });
                    break;
                }
            });
            break;
        }
        case 'subject': {
            await interaction.deferReply({ ephemeral: true }); 
           
            const settingsEmbed = new MessageEmbed()
                .setColor('#ffffff');

            const user = interaction.options.getUser('user') || interaction.user;

            const client = interaction.client;

            settingsEmbed
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`Current subject settings: `);
            const menu = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected')
                        .addOptions([
                        {
                            label: 'All',
                            description: 'All subjects: astronomy, biology, earth science, chemistry, physics, mathematics, and energy',
                            value: 'potpourri',
                        },
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
                        }
                        ]),
                );

            await interaction.followUp({ embeds: [settingsEmbed], components: [menu] });

            client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            var values = interaction.values[0]; 
            switch(values)  {
                case 'potpourri':
                    //everything stuff
                    await interaction.update({ content: 'Subject set to: everything', components: [] });
                    break;
                case 'astro':
                    //astronomy stuff
                    await interaction.update({ content: 'Subject set to: astronomy', components: [] });
                    break;
                case 'bio':
                    //biology stuff
                    await interaction.update({ content: 'Subject set to: biology', components: [] });
                    break;
                case 'es':
                    //earth science stuff
                    await interaction.update({ content: 'Subject set to: earth science', components: [] });
                    break;
                case 'chem':
                    //chemistry stuff
                    await interaction.update({ content: 'Subject set to: chemistry', components: [] });
                    break;
                case 'phy':
                    //physics stuff
                    await interaction.update({ content: 'Subject set to: physics', components: [] });
                    break;
                case 'math':
                    //math stuff
                    await interaction.update({ content: 'Subject set to: mathematics', components: [] });
                    break;
                case 'energy':
                    //the united states department of energy is a cabinet-level agency responsible for the creation and management of...
                    await interaction.update({ content: 'Subject set to: energy', components: [] });
                    break;
                }
            });
            break;
        }
    }
}