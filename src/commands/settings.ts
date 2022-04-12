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
            break;
        }
    }
}