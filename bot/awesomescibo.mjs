#!/usr/bin/env node

import * as Discord from 'discord.js';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as commands from './commands.js';

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

let hits = 0;

if (fs.existsSync('numhits.txt')) {
    fs.readFile('numhits.txt', 'utf8', function (err, data) {
        hits = data;
        if (err) {
            console.log(err);
        }
    });
} else {
    fs.writeFile('numhits.txt', hits.toString(), (error) => { if (error) { console.log(error); } });
}

client.once('ready', () => {
    console.log(client.user.username);
    client.user.setActivity("for \"do be helping\" | add me to your own server: adat.link/awscibo", { type: "WATCHING" });
});

client.on('guildCreate', guild => {
    guild.channels.cache.find(channel => channel.name === 'general' && channel.type === 'text').send("'Sup, I'm the AwesomeSciBo bot!").catch(console.error);
});

client.on('message', async message => {

    if (message.author.bot) {
        return;
    }

    const formattedMessage = message.content.toLowerCase().replace(/\s+/g, '');
    if (formattedMessage.startsWith("dobe")) {
        switch (formattedMessage) {
            case 'dobehits':
                commands.checkHits(message, hits);
                break;
            case 'dobehelping':
                commands.sendHelpMessage(message);
                break;
            case 'doberoundgen':
                commands.generateRound(message, false);
                break;
            case 'doberoundgendm':
                commands.generateRound(message, true);
                break;
            case 'dobescoring':
                commands.startScoring(message);
                break;
            case 'dobetop':
                commands.showLeaderboard(message);
                break;
            case 'dobehappy':
                commands.dontWorryBeHappy(message);
                break;
            case 'dobeservers':
                commands.showServerNumber(message);
                break;
            case 'dobeiss':
                commands.showIssLocation(message);
                break;
            default:
                commands.otherCommands(message);
        }
    }
});

client.login(process.argv[2]).catch(error => console.log(error));
