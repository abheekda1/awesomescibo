import {SlashCommandBuilder} from '@discordjs/builders';
import {MessageEmbed, CommandInteraction} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with a help message explaining what the bot can do');

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    await interaction.deferReply();

    const helpEmbed = new MessageEmbed()
        .setDescription('AwesomeSciBo has migrated to using slash commands! You can take a look at the different commands by typing `/` and clicking on the AwesomeSciBo icon.')
        .setColor('#ffffff');
    interaction.followUp({embeds: [helpEmbed]});
}