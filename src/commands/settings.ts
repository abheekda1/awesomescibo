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
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                    },
                    {
                        label: 'You can select me too',
                        description: 'This is also a description',
                        value: 'second_option',
                    },
                ]),
        );
    await interaction.followUp({ embeds: [settingsEmbed] });
    
}