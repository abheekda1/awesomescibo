import * as Discord from 'discord.js';
import { execSync } from 'child_process';
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
import fetch from 'node-fetch';
import * as fs from 'fs';
var hits = 0;
fs.readFile('numhits.txt', 'utf8', function(error, data){
    hits = data;
    if (error) {
        console.log(error);
    }
});


client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity("for \"do be helping\"", { type: "WATCHING" });
});

client.on('guildCreate', guild => {
  guild.channels.cache.find(channel => channel.name === 'general').send("what is up peeps I am roundbutt");
});

client.on('message', async message => {
    if (message.content.toLowerCase() === "do be hits") {
        message.channel.send(hits);
        fs.writeFile('numhits.txt', hits, (error) => { if (error) { console.log(error); } });
    }
  if (message.content.toLowerCase() === ("do be helping")) {
    message.channel.send(new Discord.MessageEmbed().setTitle("Help").setDescription("`do be helping`: display this help message\n`do be roundgen html`: send a round to the channel\n`do be roundgen html dm`: dm a round to you\n`do be roundgen pdf`: send a pdf round to the channel\n`do be roundgen pdf dm`: dm a pdf round to you\n`do be scoring`: start a scoring session\n - `do be scoring (a/b)(4/10)`: add points to Team A or Team B\n - `do be scoring stop`: end scoring session and post final points\n`do be hits`: send the number of round requests"));

  }
  if (message.content.toLowerCase() === ("do be roundgen html dm")) {
    fs.writeFile('round.html', "<h1>Here's your round!</h1>", (error) => { if (error) { console.log(error); } });
    var person = client.users.cache.get(message.author.id);
    var i;
    let generatingMsg = await message.channel.send("Generating...");
    for (i = 1; i < 26; i++) {
      var tossup_question;
      var question_category;
      var tossup_format;
      var tossup_answer;
      var bonus_question;
      var bonus_format;
      var bonus_answer;
      var htmlContent = "";
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
          htmlContent = `<br><br>${i}. Tossup\n<br><br>` + `<strong>${question_category}</strong>`  +  " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br><br>";
          htmlContent += "<br><br>Bonus\n<br><br>" + `<strong>${question_category}</strong>`  +  " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br>";
          htmlContent = htmlContent.replace(/\n/g, "<br>");
          fs.appendFile('round.html', htmlContent, (error) => { if (error) { console.log(error); } });
        });
    }
    generatingMsg.delete( {timeout: 1000} );
    setTimeout(function () { person.send(new Discord.MessageEmbed().setTitle("Here's your round!").attachFiles("round.html")); }, 1000);
    hits++;
  }
  if (message.content.toLowerCase() === ("do be roundgen html")) {
    fs.writeFile('round.html', "<h1>Here's your round!</h1>", (error) => { if (error) { console.log(error); } });
    var i;
    let generatingMsg = await message.channel.send("Generating...");
    for (i = 1; i < 26; i++) {
      var tossup_question;
      var question_category;
      var tossup_format;
      var tossup_answer;
      var bonus_question;
      var bonus_format;
      var bonus_answer;
      var htmlContent = "";
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
          htmlContent = `<br><br>${i}. Tossup\n<br><br>` + `<strong>${question_category}</strong>`  +  " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br><br>";
          htmlContent += "<br><br>Bonus\n<br><br>" + `<strong>${question_category}</strong>`  +  " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br>";
          htmlContent = htmlContent.replace(/\n/g, "<br>");
          fs.appendFile('round.html', htmlContent, (error) => { if (error) { console.log(error); } });
        });
    }
    generatingMsg.delete( {timeout: 1000} );
    setTimeout(function () { message.channel.send(new Discord.MessageEmbed().setTitle("Here's your round!").attachFiles("round.html")); }, 1000);
    hits++;
  }
    if (message.content.toLowerCase() === ("do be roundgen pdf dm")) {
    fs.writeFile('index.html', "<h1>Here's your round!</h1>", (error) => { if (error) { console.log(error); } });
    var person = client.users.cache.get(message.author.id);
    var i;
    let generatingMsg = await message.channel.send("Generating...");
    for (i = 1; i < 26; i++) {
      var tossup_question;
      var question_category;
      var tossup_format;
      var tossup_answer;
      var bonus_question;
      var bonus_format;
      var bonus_answer;
      var htmlContent = "";
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
          htmlContent = `<br><br>${i}. Tossup\n<br><br>` + `<strong>${question_category}</strong>`  +  " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br><br>";
          htmlContent += "<br><br>Bonus\n<br><br>" + `<strong>${question_category}</strong>`  +  " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br>";
          htmlContent = htmlContent.replace(/\n/g, "<br>");
          fs.appendFile('index.html', htmlContent, (error) => { if (error) { console.log(error); } });
        });
    }
    generatingMsg.delete( {timeout: 1000} );
    var output = execSync("curl --request POST --url http://localhost:3136/convert/html --header 'Content-Type: multipart/form-data' --form files=@index.html -o round.pdf",  { encoding: 'utf-8' });
    //console.log(output);
    setTimeout(function () { person.send(new Discord.MessageEmbed().setTitle("Here's your round!").attachFiles("round.pdf")); }, 1000);
    hits++;
  }

  if (message.content.toLowerCase() === ("do be roundgen pdf")) {
    fs.writeFile('index.html', "<h1>Here's your round!</h1>", (error) => { if (error) { console.log(error); } });
    var i;
    let generatingMsg = await message.channel.send("Generating...");
    for (i = 1; i < 26; i++) {
      var tossup_question;
      var question_category;
      var tossup_format;
      var tossup_answer;
      var bonus_question;
      var bonus_format;
      var bonus_answer;
      var htmlContent = "";
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
          htmlContent = `<br><br>${i}. Tossup\n<br><br>` + `<strong>${question_category}</strong>`  +  " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br><br>";
          htmlContent += "<br><br>Bonus\n<br><br>" + `<strong>${question_category}</strong>`  +  " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br>";
          htmlContent = htmlContent.replace(/\n/g, "<br>");
          fs.appendFile('index.html', htmlContent, (error) => { if (error) { console.log(error); } });
        });
    }
    generatingMsg.delete( {timeout: 1000} );
    var output = execSync("curl --request POST --url http://localhost:3136/convert/html --header 'Content-Type: multipart/form-data' --form files=@index.html -o round.pdf",  { encoding: 'utf-8' });
    //console.log(output);
    message.channel.send(new Discord.MessageEmbed().setTitle("Here's your round!").attachFiles("round.pdf"));
    hits++;
  }
    if (message.content.toLowerCase() === "do be scoring") {
      var scoreA = 0;
      var scoreB = 0;
      let scoreboard = await message.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`)
        .then((scoreboard) => {
          const filter = m => m.content.includes('do be');
          const collector = message.channel.createMessageCollector(filter, { time: 1500000 });
          collector.on('collect', m => {
            if (m.content.toLowerCase() === "do be scoring a 4") {
              m.delete( { timeout: 1000 } );
              scoreA += 4;
              scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
            } else if (m.content.toLowerCase() === "do be scoring a 10") {
              m.delete( { timeout: 1000 } );
              scoreA += 10;
              scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
            } else if (m.content.toLowerCase() === "do be scoring b 4") {
              m.delete( { timeout: 1000 } );
              scoreB += 4;
              scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
            } else if (m.content.toLowerCase() === "do be scoring b 10") {
              m.delete( { timeout: 1000 } );
              scoreB += 10;
              scoreboard.channel.send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
            } else if (m.content === "do be scoring stop") {
              m.delete( { timeout: 1000 } );
              scoreboard.delete( { timeout: 1000} );
              m.channel.send(`**FINAL SCORE:**\nTeam A: ${scoreA}\nTeam B: ${scoreB}`);
              collector.stop();
            }
          });
        })
    }

    if (message.content.toLowerCase() === "do be happy") {
      message.channel.send(new Discord.MessageEmbed().setTitle(`Don't Worry Be Happy!`).setImage("https://media.giphy.com/media/7OKC8ZpTT0PVm/giphy.gif").setURL("https://youtu.be/d-diB65scQU"));
    }

    if (message.content.toLowerCase() === "do be servers") {
        message.channel.send(client.guilds.cache.size);
    }

    if (message.content.toLowerCase() === "do be pog") {
        message.channel.send(new Discord.MessageEmbed().setTitle("POG POG POG").setURL("https://media.giphy.com/media/c5skRQb3BXp8RwKGKW/giphy.gif").setImage("https://media.giphy.com/media/c5skRQb3BXp8RwKGKW/giphy.gif"));
    }

/*    if (message.content.toLowerCase() === "do be user channel create") {
      const userChannel = await message.guild.channels.create('Users: ' + message.guild.memberCount, {
        reason: 'Create channel to track number of users',
        type: 'voice'
      })
        //.then(console.log)
        .catch(console.error);
      
      console.log(userChannel.id);
      setInterval(async () => { await message.guild.channels.cache.get(userChannel.id).setName('Members: ' + message.guild.memberCount).catch(console.error); }, 10000);
    }*/
});

client.login("BOT TOKEN HERE");
