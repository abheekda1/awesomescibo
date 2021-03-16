#!/usr/bin/env node

import * as Discord from 'discord.js';
import { execSync } from 'child_process';
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

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
  client.user.setActivity("for \"do be helping\"", { type: "WATCHING" });
});

client.on('guildCreate', guild => {
  guild.channels.cache.find(channel => channel.name === 'general').send("'Sup, I'm the AwesomeSciBo bot!");
});

client.on('message', async message => {

  if (message.author.bot) {
    return;
  }

  const formattedMessage = message.content.toLowerCase().replace(/\s+/g, '');
  if (formattedMessage.startsWith("dobe")) {
    switch (formattedMessage) {
      case 'dobehits':
        checkHits();
        break;
      case 'dobehelping':
        sendHelpMessage();
        break;
      case 'doberoundgen':
        generateRound(false);
        break;
      case 'doberoundgendm':
        generateRound(true);
        break;
      case 'dobescoring':
        startScoring();
        break;
      case 'dobetop':
        showLeaderboard();
        break;
      case 'dobehappy':
        dontWorryBeHappy();
        break;
      case 'dobeservers':
        showServerNumber();
        break;
      case 'dobeiss':
        showIssLocation();
        break;
      default:
        otherCommands();
    }
  }

  async function otherCommands() {
    if (message.content.toLowerCase().startsWith("do be announcing") && message.author.id === process.argv[3]) {
      const announcement = message.content.substring(17);
      client.guilds.cache.forEach((guild) => {
        const channel = guild.channels.cache.find(channel => channel.name === 'general');
        if (channel) {
          if (channel.type === "text") {
            channel.send(announcement).catch(console.error);
          }
        }
      });
    } else if (message.content.toLowerCase().startsWith("do be training")) {
      if (message.content === "do be training") {
        const author = message.author;
        fetch("https://scibowldb.com/api/questions/random")
        .then(response => response.json())
        .then(data => {
          let filter = m => m.author.id === message.author.id;
          message.reply(data.question.tossup_question).then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time']
            })
            .then(message => {
              message = message.first();
              let score = 0;
              if (fs.existsSync(`userScore/${message.author.id}`)) {
                fs.readFile(`userScore/${message.author.id}`, 'utf8', function (err, data) {
                  score = Number(data);
                  if (err) {
                    console.log(err);
                  }
                });
              } else {
                fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
              }
              let predicted = "unsure";
              if (data.question.tossup_format === "Multiple Choice") {
                if (message.content.charAt(0).toLowerCase() === data.question.tossup_answer.charAt(0).toLowerCase()) {
                  predicted = "correct";
                } else {
                  predicted = "incorrect";
                }
              } else {
                  if (message.content.toLowerCase() === data.question.tossup_answer.toLowerCase()) {
                      predicted = "correct";
                  } else {
                      predicted = "incorrect";
                  }
              }
              message.channel.send(`Correct answer: **${data.question.tossup_answer}**. Predicted: **${predicted}**. Please react to your answer!`);
              message.react('✅');
              message.react('❌');
              const filter = (reaction, user) => {
    	          return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
              };
              message.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(userReaction => {
                  const reaction = userReaction.first();
                  if (reaction.emoji.name === "❌") {
                    fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
                    message.reply(`nice try! Your score is now ${score}`);
                  } else {
                    score += 4;
                    fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
                    message.reply(`nice job! Your score is now ${score}`);
                    fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
                  }
                })
                .catch(collected => {
                })
            })
            .catch ((collected, error) => {
              message.reply('\n**ANSWER TIMEOUT**');
            })
          })
        })
      } else {
        const subject = message.content.substring(15);
        let subjectURL;
        switch (subject) {
          case 'astro':
          case 'astronomy':
            subjectURL = `https://moose.lcsrc.org/subjects/astronomy.json`;
            break;
          case 'bio':
          case 'biology':
            subjectURL = `https://moose.lcsrc.org/subjects/biology.json`;
            break;
          case 'ess':
          case 'earth science':
          case 'es':
            subjectURL = `https://moose.lcsrc.org/subjects/ess.json`;
            break;
          case 'chem':
          case 'chemistry':
            subjectURL = `https://moose.lcsrc.org/subjects/chemistry.json`;
            break;
          case 'phys':
          case 'physics':
            subjectURL = `https://moose.lcsrc.org/subjects/physics.json`;
            break;
          case 'math':
            subjectURL = `https://moose.lcsrc.org/subjects/math.json`;
            break;
          case 'energy':
            subjectURL = `https://moose.lcsrc.org/subjects/energy.json`;
            break;
          default:
            message.channel.send("Not a valid subject!");
            return;
            break;
        }
        const author = message.author;
        fetch(subjectURL)
        .then(response => response.json())
        .then(data => {
          const questionNum = Math.floor(Math.random() * data.length);
          let filter = m => m.author.id === message.author.id;
          message.reply(data[questionNum].tossup_question).then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time']
            })
            .then(message => {
              message = message.first();
              let score = 0;
              if (fs.existsSync(`userScore/${message.author.id}`)) {
                fs.readFile(`userScore/${message.author.id}`, 'utf8', function (err, data) {
                  score = Number(data);
                  if (err) {
                    console.log(err);
                  }
                });
              } else {
                fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
              }
              let predicted = "unsure";
              if (data[questionNum].tossup_format === "Multiple Choice") {
                if (message.content.charAt(0).toLowerCase() === data[questionNum].tossup_answer.charAt(0).toLowerCase()) {
                  predicted = "correct";
                } else {
                  predicted = "incorrect";
                }
              } else {
                  if (message.content.toLowerCase() === data[questionNum].tossup_answer.toLowerCase()) {
                      predicted = "correct";
                  } else {
                      predicted = "incorrect";
                  }
              }
              message.channel.send(`Correct answer: **${data[questionNum].tossup_answer}**. Predicted: **${predicted}**. Please react to your answer!`);
              message.react('✅');
              message.react('❌');
              const filter = (reaction, user) => {
                return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
              };
              message.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(userReaction => {
                  const reaction = userReaction.first();
                  if (reaction.emoji.name === "❌") {
                    fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
                    message.reply(`nice try! Your score is now ${score}`);
                  } else {
                    score += 4;
                    fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
                    message.reply(`nice job! Your score is now ${score}`);
                    fs.writeFile(`userScore/${message.author.id}`, score.toString(), (error) => { if (error) { console.log(error); } });
                  }
                })
                .catch(collected => {
                })
            })
            .catch ((collected, error) => {
              message.reply('\n**ANSWER TIMEOUT**');
            })
          })
        })
      }
    } else {
      if (formattedMessage.startsWith("dobescoring" || "dobetraining")) {
        return;
      }
      message.channel.send("That didn't quite make sense! Please use `do be helping` to see the available commands.")
    }
  }

  async function checkHits() {
    message.channel.send(hits);
    fs.writeFile('numhits.txt', hits.toString(), (error) => { if (error) { console.log(error); } });
  }

  async function sendHelpMessage() {
    message.channel.send(new Discord.MessageEmbed().setTitle("Help").setDescription(helpMessage));
  }

  async function generateRound(isDM) {
    fs.writeFile('index.html', "<h1>Here's your round!</h1>", (error) => { if (error) { console.log(error); } });
    let i;
    let generatingMsg = await message.channel.send("Generating...");
    for (i = 1; i < 26; i++) {
      let tossup_question;
      let question_category;
      let tossup_format;
      let tossup_answer;
      let bonus_question;
      let bonus_format;
      let bonus_answer;
      let htmlContent = "";
      await fetch('https://scibowldb.com/api/questions/random')
        .then(response => response.json())
        .then(data => {
          tossup_question = data.question.tossup_question;
          tossup_answer = data.question.tossup_answer;
          question_category = data.question.category;
          tossup_format = data.question.tossup_format;
          bonus_question = data.question.bonus_question;
          bonus_answer = data.question.bonus_answer;
          bonus_format = data.question.bonus_format;
          htmlContent = `<br><br>${i}. Tossup\n<br><br>` + `<strong>${question_category}</strong>` + " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br><br>";
          htmlContent += "<br><br>Bonus\n<br><br>" + `<strong>${question_category}</strong>` + " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br>";
          htmlContent = htmlContent.replace(/\n/g, "<br>");
          fs.appendFile('index.html', htmlContent, (error) => { if (error) { console.log(error); } });
        });
    }
    generatingMsg.delete({ timeout: 100 });
    execSync("curl --request POST --url http://localhost:3136/convert/html --header 'Content-Type: multipart/form-data' --form files=@index.html -o round.pdf", { encoding: 'utf-8' });
    if (isDM) {
      client.users.cache.get(message.author.id).send(new Discord.MessageEmbed().setTitle("Here's your round!").attachFiles("round.pdf"));
    } else {
      message.channel.send(new Discord.MessageEmbed().setTitle("Here's your round!").attachFiles("round.pdf"));
    }
    hits++;
  }

  async function startScoring() {
    let scoreA = 0;
    let scoreB = 0;
    const scoreboard = await message.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`)
      .then((scoreboard) => {
        const filter = m => m.content.includes('do be');
        const collector = message.channel.createMessageCollector(filter, { time: 1500000 });
        collector.on('collect', m => {
          if (m.content.toLowerCase() === "do be scoring a 4") {
            m.delete({ timeout: 1000 });
            scoreA += 4;
            scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
          } else if (m.content.toLowerCase() === "do be scoring a 10") {
            m.delete({ timeout: 1000 });
            scoreA += 10;
            scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
          } else if (m.content.toLowerCase() === "do be scoring b 4") {
            m.delete({ timeout: 1000 });
            scoreB += 4;
            scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
          } else if (m.content.toLowerCase() === "do be scoring b 10") {
            m.delete({ timeout: 1000 });
            scoreB += 10;
            scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
          } else if (m.content === "do be scoring stop") {
            m.delete({ timeout: 1000 });
            scoreboard.delete({ timeout: 1000 });
            m.channel.send(`**FINAL SCORE:**\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
            collector.stop();
          }
        });
      })
  }
  async function dontWorryBeHappy() {
    message.channel.send(new Discord.MessageEmbed().setTitle(`Don't Worry Be Happy!`).setImage("https://media.giphy.com/media/7OKC8ZpTT0PVm/giphy.gif").setURL("https://youtu.be/d-diB65scQU"));
  }

  async function showServerNumber() {
    message.channel.send(client.guilds.cache.size);
  }

  async function showIssLocation() {
    await fetch("http://api.open-notify.org/iss-now.json")
      .then(request => request.json())
      .then(data => {
        message.channel.send(new Discord.MessageEmbed().setTitle("The current location of the ISS!").setImage(`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+000(${data.iss_position.longitude},${data.iss_position.latitude})/-87.0186,20,1/1000x1000?access_token=pk.eyJ1IjoiYWRhd2Vzb21lZ3V5IiwiYSI6ImNrbGpuaWdrYzJ0bGYydXBja2xsNmd2YTcifQ.Ude0UFOf9lFcQ-3BANWY5A`).setURL('https://spotthestation.nasa.gov/tracking_map.cfm'));
      });
  }

  async function showLeaderboard() {
    let messageContent = '';
    let scores = [];

    const directoryPath = path.join('userScore');
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      files.forEach(function (file) {
          scores.push(`${fs.readFileSync('userScore/' + file, 'utf8')}|<@${file}>`)
      });
      const scoresFodrmatted = scores.sort(function(a, b){return b.split('|')[0] - a.split('|')[0]});
      if (scores.length < 10) {
        message.channel.send("Not enough scores yet!");
        return;
      }
      for (let i = 0; i < 10; i++) {
        const currentScore = scoresFormatted[i].split('|');
        messageContent += `${currentScore[1]}: ${currentScore[0]}\n\n`;
      }
      message.channel.send(new Discord.MessageEmbed().setTitle('Top Ten!').setDescription(messageContent));
    });
  }
});

client.login(process.argv[2]).catch(error => console.log(error));
