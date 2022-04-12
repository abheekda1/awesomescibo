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
            break;
        }
        case 'subject': {
            await interaction.deferReply({ ephemeral: true }); 

            const subject = interaction.options.get('subject') ? interaction.options.get('subject')?.value : null;

            let categoryArray : string[] = [];

            let integers = Math.floor((Math.random() * categoryArray.length) + 1);

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
                interaction.followUp({
                    embeds: [new MessageEmbed()
                        .setDescription('<:red_x:816791117671825409> Not a valid subject!')
                        .setColor('#ffffff')],
                });
                return;
            }

            let h = categoryArray[integers]; //this method may not function because it will sest this once and never change it again until user changes settings?
            
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
    }
}