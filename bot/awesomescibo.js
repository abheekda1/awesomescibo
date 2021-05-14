#!/usr/bin/env node

const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const fetch = require("node-fetch");
const axios = require("axios");
const userScore = require("./mongooseModels/mongooseUserScoreModel.js");
const generatedRound = require("./mongooseModels/mongooseGeneratedRoundModel.js");
const mongoose = require("mongoose");
const gitlog = require("gitlog").default;

const helpMessage =
  "`do be helping`: display this help message\n`do be roundgen`: send a pdf round to the channel\n`do be scoring`: start a scoring session\n > `do be scoring (a/b)(4/10)`: add points to Team A or Team B\n > `do be scoring stop`: end scoring session and post final points\n > `do be servers`: send the number of servers this bot is a part of\n > `do be iss`: show the current location of the International Space Station\n`do be training`: send a quick practice problem (you **must** react to your answer, or the bot will yell at you)\n > subject options: astro, phys, chem, math, bio, ess, energy\n`do be top`: list cross-server top 10 players\n `do be about`: List people who contributed to this bot\n Source Code: https://github.com/ADawesomeguy/AwesomeSciBo (don't forget to star!)";

client.once("ready", () => {
  // Connect to MongoDB using mongoose
  if (!process.env.CI) {
    mongoose
      .connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        // Log client tag and set status
        console.log(`Logged in as: ${client.user.username}!`);
        client.user.setActivity(
          'for "do be helping" | Add me to your own server: adat.link/awscibo',
          { type: "WATCHING" }
        );
      })
      .catch((err) => console.log(err));
    }
});

client.on("guildCreate", (guild) => {
  guild.channels.cache
    .find(
      (channel) =>
        // Find channel by name
        channel.name === process.env.WELCOME_CHANNEL && channel.type === "text"
    )
    .send("'Sup, I'm the AwesomeSciBo bot!")
    .catch(console.error);
});

async function updateScore(isCorrect, score, authorId) {
  if (!isCorrect) {
    return `nice try! Your score is still ${score}.`;
  } else {
    score += 4;
    if (score == 4) {
      const newUserScore = new userScore({
        authorID: authorId,
        score: score,
      });
      newUserScore.save((err) =>
        err
          ? console.log("Error creating new user for scoring")
          : console.log("Sucessfully created user to score.")
      );
    } else {
      const doc = await userScore.findOne({
        authorID: authorId,
      });
      doc.score = doc.score + 4;
      doc.save();
    }

    return `great job! Your score is now ${score}.`;
  }
}

async function otherCommands(message) {
  if (
    message.content.toLowerCase().startsWith("do be announcing") &&
    (message.author.id === process.env.ABHEEK_USER_ID ||
      message.author.id === process.env.TEJAS_USER_ID)
  ) {
    const announcement = message.content.substring(17);
    client.guilds.cache.forEach((guild) => {
      const channel = guild.channels.cache.find(
        (channelGeneral) =>
          channelGeneral.name === process.env.ANNOUNCING_CHANNEL
      );
      if (channel) {
        if (channel.type === "text") {
          channel.send(announcement).catch(console.error);
        }
      }
    });
  } else if (message.content.toLowerCase().startsWith("do be training")) {
    const authorId = message.author.id;
    let score;
    userScore
      .findOne({ authorID: authorId })
      .lean()
      .then((obj, err) => {
        if (!obj) {
          score = 0;
        } else if (obj) {
          score = obj.score;
        } else {
          console.log(err);
        }
      });
      const subject = message.content.substring(15);
      let categoryArray = [];

      switch (subject) {
        case "":
          categoryArray = ["BIOLOGY", "PHYSICS", "CHEMISTRY", "EARTH AND SPACE", "ASTRONOMY", "MATH"];
          break;
        case "astro":
        case "astronomy":
          categoryArray = ["ASTRONOMY"]
          break;
        case "bio":
        case "biology":
          categoryArray = ["BIOLOGY"];
          break;
        case "ess":
        case "earth science":
        case "es":
          categoryArray = ["EARTH SCIENCE"];
          break;
        case "chem":
        case "chemistry":
          categoryArray = ["CHEMISTRY"];
          break;
        case "phys":
        case "physics":
          categoryArray = ["PHYSICS"];
          break;
        case "math":
          categoryArray = ["MATH"];
          break;
        case "energy":
          categoryArray = ["ENERGY"];
          break;
        default:
          message.channel.send("Not a valid subject!");
          return;
      }

      axios
        .post("https://scibowldb.com/api/questions/random", { categories: categoryArray })
        .then((res) => {
          data = res.data.question;
          const messageFilter = (m) => m.author.id === authorId;
          message.reply(data.tossup_question).then(() => {
            message.channel
              .awaitMessages(messageFilter, {
                max: 1,
                time: 30000,
                errors: ["time"],
              })
              .then((answerMsg) => {
                answerMsg = answerMsg.first();

                let predicted = null;
                if (data.tossup_format === "Multiple Choice") {
                  if (
                    answerMsg.content.charAt(0).toLowerCase() ===
                    data.tossup_answer.charAt(0).toLowerCase()
                  ) {
                    predicted = "correct";
                  } else {
                    predicted = "incorrect";
                  }
                } else {
                  if (
                    answerMsg.content.toLowerCase() ===
                    data.tossup_answer.toLowerCase()
                  ) {
                    predicted = "correct";
                  } else {
                    predicted = "incorrect";
                  }
                }

                if (predicted === "correct") {
                  updateScore(true, score, authorId).then((msgToReply) =>
                    answerMsg.reply(msgToReply)
                  );
                } else {
                  const overrideEmbed = new Discord.MessageEmbed()
                  .setAuthor(answerMsg.author.tag, answerMsg.author.displayAvatarURL())
                  .addField("Correct answer", `\`${data.tossup_answer}\``)
                  .setDescription(`It seems your answer was incorrect. Please react with <:override:842778128966615060> to override your answer if you think you got it right.`)
                  .setTimestamp();
                  const overrideMsg = answerMsg.channel.send(
                    overrideEmbed
                  )
                  .then(overrideMsg => {
                    overrideMsg.react("<:override:842778128966615060>");
                    const filter = (reaction, user) => {
                      return (
                        ["override"].includes(reaction.emoji.name) &&
                        user.id === answerMsg.author.id
                      );
                    };
                    overrideMsg
                      .awaitReactions(filter, {
                        max: 1,
                        time: 600000,
                        errors: ["time"],
                      })
                      .then((userReaction) => {
                        updateScore(true, score, authorId).then((msgToReply) =>
                          answerMsg.reply(msgToReply)
                        );
                      });
                  })
                }
              })
              .catch(console.error);
          });
        })
        .catch(console.error);
  } else {
    // Not any of the commands supported
    message.channel.send(
      "That didn't quite make sense! Please use `do be helping` to see the available commands."
    );
  }
}

function sendHelpMessage(message) {
  message.channel.send(
    new Discord.MessageEmbed().setTitle("Help").setDescription(helpMessage)
  );
}

async function generateRound(message) {
  const generatingMessage = message.channel.send("Generating...");
  let i;
  let finalizedHTML = '<html><head><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet"> </head><body style="width: 70%; margin-left: auto; margin-right: auto;"><h2 style="text-align: center; text-decoration: underline overline; padding: 7px;">ROUND GENERATED BY AWESOMESCIBO USING THE SCIBOWLDB API</h2>';
    let tossup_question;
    let question_category;
    let tossup_format;
    let tossup_answer;
    let bonus_question;
    let bonus_format;
    let bonus_answer;
    let htmlContent = "";
    await axios.post("https://scibowldb.com/api/questions", { categories: ["BIOLOGY", "PHYSICS", "CHEMISTRY", "EARTH AND SPACE", "ASTRONOMY", "MATH"] })
      .then((response) => {
        for (i = 1; i < 26; i++) {
            data = response.data.questions[Math.floor(Math.random() * response.data.questions.length)];
            tossup_question = data.tossup_question;
            tossup_answer = data.tossup_answer;
            question_category = data.category;
            tossup_format = data.tossup_format;
            bonus_question = data.bonus_question;
            bonus_answer = data.bonus_answer;
            bonus_format = data.bonus_format;
            htmlContent = `<br><br><h3 style="text-align: center;"><strong>TOSS-UP</strong></h3>\n<br>` + `${i}) <strong>${question_category}</strong>` + " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br>";
            htmlContent += `<br><br><h3 style="text-align: center;"><strong>BONUS</strong></h3>\n<br>` + `${i}) <strong>${question_category}</strong>` + " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br><hr><br>";
            htmlContent = htmlContent.replace(/\n/g, "<br>");
            finalizedHTML += htmlContent;
        }
        newGeneratedRound = new generatedRound({
          htmlContent: finalizedHTML,
          requestedBy: message.author.id,
          authorTag: message.author.tag,
          timestamp: new Date().toISOString(),
        });
        newGeneratedRound.save((err, round) => {
          if (err) {
            console.log(err);
            return;
          }
          message.channel.messages.fetch(generatingMessage.id)
          .then(generatingMessage => {
            const msg = generatingMessage.first();
            msg.edit(`${message.author}, here's your round: https://api.adawesome.tech/round/${round._id.toString()}`);
          });
        });
      });
    }

async function startScoring(message) {
  let scoreA = 0;
  let scoreB = 0;
  await message.channel
    .send(`Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`)
    .then((scoreboard) => {
      const filter = (m) => m.content.includes("do be");
      const collector = message.channel.createMessageCollector(filter, {
        time: 1500000,
      });
      collector.on("collect", (m) => {
        if (m.content.toLowerCase() === "do be scoring a 4") {
          // A team gets toss-up
          m.delete({ timeout: 1000 }).catch(console.error);
          scoreA += 4;
          scoreboard.channel.send(
            `Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`
          );
        } else if (m.content.toLowerCase() === "do be scoring a 10") {
          // A team gets bonus
          m.delete({ timeout: 1000 }).catch(console.error);
          scoreA += 10;
          scoreboard.channel.send(
            `Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`
          );
        } else if (m.content.toLowerCase() === "do be scoring b 4") {
          // B team gets toss up
          m.delete({ timeout: 1000 }).catch(console.error);
          scoreB += 4;
          scoreboard.channel.send(
            `Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`
          );
        } else if (m.content.toLowerCase() === "do be scoring b 10") {
          // B team gets bonus
          m.delete({ timeout: 1000 }).catch(console.error);
          scoreB += 10;
          scoreboard.channel.send(
            `Here's the score:\nTeam A: ${scoreA}\nTeam B: ${scoreB}`
          );
        } else if (m.content === "do be scoring stop") {
          m.delete({ timeout: 1000 }).catch(console.error);
          scoreboard.delete({ timeout: 1000 });
          m.channel.send(
            `**FINAL SCORE:**\nTeam A: ${scoreA}\nTeam B: ${scoreB}`
          );
          collector.stop();
        }
      });
    });
}

function dontWorryBeHappy(message) {
  message.channel.send(
    new Discord.MessageEmbed()
      .setTitle(`Don't Worry Be Happy!`)
      .setImage("https://media.giphy.com/media/7OKC8ZpTT0PVm/giphy.gif")
      .setURL("https://youtu.be/d-diB65scQU")
  );
}

function showServerNumber(message) {
  message.channel.send(client.guilds.cache.size);
}

async function showIssLocation(message) {
  await fetch("http://api.open-notify.org/iss-now.json")
    .then((request) => request.json())
    .then((data) => {
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("The current location of the ISS!")
          .setImage(
            `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+000(${data.iss_position.longitude},${data.iss_position.latitude})/-87.0186,20,1/1000x1000?access_token=pk.eyJ1IjoiYWRhd2Vzb21lZ3V5IiwiYSI6ImNrbGpuaWdrYzJ0bGYydXBja2xsNmd2YTcifQ.Ude0UFOf9lFcQ-3BANWY5A`
          )
          .setURL("https://spotthestation.nasa.gov/tracking_map.cfm")
      );
    });
}

function showLeaderboard(message) {
  let messageContent = "";
  userScore
    .find({})
    .sort({ score: -1 }) // Sort by descending order
    .exec((err, obj) => {
      if (err) {
        console.log(err);
        return message.reply(
          "Uh oh! :( There was an internal error. Please try again."
        );
      }
      if (obj.length < 10) {
        // Need at least 10 scores for top 10
        return message.reply(
          `There are only ${obj.length} users, we need at least 10!`
        );
      }
      for (let i = 0; i < 10; i++) {
        messageContent += `${i + 1}: <@${obj[i].authorID}>: ${obj[i].score}\n`; // Loop through each user and add their name and score to leaderboard content
      }
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Top Ten!")
          .setDescription(messageContent)
      );
    });
}

function aboutMessage(message) {
  message.channel.send(
    new Discord.MessageEmbed().setTitle("Contributors: ").setDescription(`
        <@745063586422063214> [ADawesomeguy#2235]
        <@650525101048987649> [tEjAs#8127]
      `) // Add more contributors here, first one is Abheek, second one is Tejas
  );
}

async function userRounds(message) {
  let rounds = await generatedRound.find({ requestedBy: message.author.id }).sort({ timestamp: -1 });
  let finalMessage = "";
  if (!rounds) {
    message.reply("you haven't requested any rounds!");
    return;
  }

  if (rounds.length > 5) {
    rounds = rounds.slice(0, 5);
  }

  rounds.forEach(async (item, index) => {
    finalMessage += `${index + 1}. [${item.timestamp.split("T")[0]}](https://api.adawesome.tech/round/${item._id.toString()})\n`;
  });

  const roundsEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle(`Last 5 rounds requested by ${message.author.tag}`)
    .setDescription(finalMessage)
    .setTimestamp();

  message.channel.send(roundsEmbed);
}

async function hits(message) {
  let totalCount = await generatedRound.countDocuments({});
  let userCount = await generatedRound.countDocuments({ requestedBy: message.author.id });

  message.channel.send(`Total Hits: ${totalCount}\nYour Hits: ${userCount}`);
}

async function changelog(message) {
  let parentFolder = __dirname.split("/");
  parentFolder.pop();
  parentFolder = parentFolder.join("/");

  const commits = gitlog({
    repo: parentFolder,
    number: 5,
    fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
  });

  const changelogEmbed = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setTitle("Changelog")
  .setTimestamp();

  commits.forEach(commit => {
    changelogEmbed.addField(commit.abbrevHash, `> \`Hash:\`${commit.hash}\n> \`Subject:\`${commit.subject}\n> \`Author:\`${commit.authorName}\n> \`Date:\`${commit.authorDateRel}\n>[Link](https://github.com/ADawesomeguy/AwesomeSciBo/commit/${commit.hash})\n`);
  });

  message.channel.send(changelogEmbed);
}

client.on("message", async (message) => {
  if (message.author.bot) {
    return;
  }

  // Temporary logging purposes

  const formattedMessage = message.content.toLowerCase().replace(/ /g, "");
  if (formattedMessage.startsWith("dobe")) {
    console.log(`${message.author.tag} > ${message.content}`);
    // Bot prefix is "do be"
    switch (formattedMessage) {
      case "dobehelping": // Display help message
        sendHelpMessage(message);
        break;
      case "doberoundgen": // Generate round publicly
        generateRound(message);
        break;
      case "dobescoring": // Start scoring
        startScoring(message);
        break;
      case "dobetop": // Top 10 scores
        showLeaderboard(message);
        break;
      case "dobehappy": // Send happy message
        dontWorryBeHappy(message);
        break;
      case "dobeservers": // Shows number of servers bot is in
        showServerNumber(message);
        break;
      case "dobeiss": // Show location of ISS
        showIssLocation(message);
        break;
      case "dobeabout": // Show about message of bot
        aboutMessage(message);
        break;
      case "dobemyrounds":
        userRounds(message);
        break;
      case "dobehits":
        hits(message);
        break;
      case "dobechangelog":
        changelog(message);
        break;
      default:
        // Do be training
        otherCommands(message);
    }
  }
});

client
  .login(process.env.TOKEN)
  .then(() => console.log("Running!"))
  .catch((error) => console.log(error));