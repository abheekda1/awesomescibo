import { SlashCommandBuilder } from '@discordjs/builders';
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
import { CommandInteraction, MessageEmbed } from 'discord.js';

import log from '../helpers/log';

export const data = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('BETA - settings configuration');


export async function execute(interaction : CommandInteraction) {
    await interaction.deferReply(); 
    const settingsEmbed = new MessageEmbed()
        .setColor('#ffffff');

    const user = interaction.options.getUser('user') || interaction.user;
    
    settingsEmbed
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(`a`);
        const menu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions([
                    {
                        label: 'Subjects',
                        description: 'Subjects',
                        value: 'subjects',
                    },
                    {
                        label: 'Grade Levels',
                        description: 'Grade Levels',
                        value: 'gradeLevels',
                    },
                ]),
        );
    await interaction.followUp({ embeds: [settingsEmbed], components: [menu] });
    await interaction.deferReply;
    const client = interaction.client;
    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;
        var values = interaction.values[1];
        switch(values)  {
            case "subjects":
                await interaction.followUp({ content: 'subjects was selected!', components: [] });
                break;
            case "gradeLevels":
                await interaction.followUp({ content: 'levels was selected!', components: [] });
                break;
        }
    });

}