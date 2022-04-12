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
    
                //everything below this line is bad
        client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;
        var values = interaction.values[0]; //potential breaking point
        switch(values)  {
            case 'subjects':
                await interaction.update({ content: 'subjects was selected!', components: [] });
                break;
            case 'gradeLevels':
                await interaction.update({ content: 'levels was selected!', components: [] });
                break;
        }
    });

}