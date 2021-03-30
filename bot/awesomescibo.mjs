#!/usr/bin/env node

import * as Discord from 'discord.js';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as commands from './commands';

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

let hits = 0;
const helpMessage = "`do be helping`: display this help message\n`do be roundgen`: send a pdf round to the channel\n`do be roundgen dm`: dm a pdf round to you\n`do be scoring`: start a scoring session\n > `do be scoring (a/b)(4/10)`: add points to Team A or Team B\n > `do be scoring stop`: end scoring session and post final points\n`do be hits`: send the number of rounds generated\n`do be servers`: send the number of servers this bot is a part of\n`do be iss`: show the current location of the International Space Station\n`do be training`: send a quick practice problem (you **must** react to your answer, or the bot will yell at you)\n > subject options: astro, phys, chem, math, bio, ess, energy\n`do be top`: list cross-server top 10 players\nSource Code: https://github.com/ADawesomeguy/AwesomeSciBo (don't forget to star!)";

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
                commands.checkHits();
                break;
            case 'dobehelping':
                commands.sendHelpMessage();
                break;
            case 'doberoundgen':
                commands.generateRound(false);
                break;
            case 'doberoundgendm':
                commands.generateRound(true);
                break;
            case 'dobescoring':
                commands.startScoring();
                break;
            case 'dobetop':
                commands.showLeaderboard();
                break;
            case 'dobehappy':
                commands.dontWorryBeHappy();
                break;
            case 'dobeservers':
                commands.showServerNumber();
                break;
            case 'dobeiss':
                commands.showIssLocation();
                break;
            default:
                commands.otherCommands();
        }
    }
});

client.login(process.argv[2]).catch(error => console.log(error));
