#!/usr/bin/env node

const Discord = require("discord.js");
const execSync = require("child_process").execSync;
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const fetch = require("node-fetch");
const fs =  require("fs");
const axios = require("axios");
const userScore = require("./mongooseModels/mongooseUserScoreModel.js");
const generatedRound = require("./mongooseModels/mongooseGeneratedRoundModel.js");
const mongoose = require("mongoose");
let config = {};
process.env.CI ? config = require("./config.default.json") : config = require("./config.json")

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

function getSubjectUrl(subject) {
  return `${config.subjectURL}${subject}.json`;
}

async function updateScore(isCorrect, score, authorId) {
  if (!isCorrect) {
    return `Nice try! Your score is still ${score}.`;
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
      console.log("Succesfully updated score.");
    }

    return `Great job! Your score is now ${score}.`;
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
    if (message.content === "do be training") {
      axios.get("https://scibowldb.com/api/questions/random").then((res) => {
        const data = res.data;
        const messageAuthorFilter = (m) => m.author.id === message.author.id;
        message.reply(data.question.tossup_question).then(() => {
          message.channel
            .awaitMessages(messageAuthorFilter, {
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then((answerMsg) => {
              answerMsg = answerMsg.first();
              let predicted = null;

              if (data.question.tossup_format === "Multiple Choice") {
                if (
                  answerMsg.content.charAt(0).toLowerCase() ===
                  data.question.tossup_answer.charAt(0).toLowerCase()
                ) {
                  predicted = "correct";
                } else {
                  predicted = "incorrect";
                }
              } else {
                if (
                  answerMsg.content.toLowerCase() ===
                  data.question.tossup_answer.toLowerCase()
                ) {
                  predicted = "correct";
                } else {
                  predicted = "incorrect";
                }
              }

              answerMsg.channel.send(
                `Correct answer: **${data.question.tossup_answer}**. Predicted: **${predicted}**. Please react to your answer!`
              );
              answerMsg.react("✅");
              answerMsg.react("❌");
              const filter = (reaction, user) => {
                return (
                  ["❌", "✅"].includes(reaction.emoji.name) &&
                  user.id === answerMsg.author.id
                );
              };
              answerMsg
                .awaitReactions(filter, {
                  max: 1,
                  time: 600000,
                  errors: ["time"],
                })
                .then((userReaction) => {
                  const reaction = userReaction.first();

                  if (reaction.emoji.name === "❌") {
                    updateScore(false, score, authorId).then((msgToReply) =>
                      answerMsg.reply(msgToReply)
                    );
                  } else {
                    updateScore(true, score, authorId).then((msgToReply) =>
                      answerMsg.reply(msgToReply)
                    );
                  }
                });
            });
        });
      });
    } else {
      const subject = message.content.substring(15);
      let subjectURL;

      switch (subject) {
        case "astro":
        case "astronomy":
          subjectURL = getSubjectUrl("astronomy");
          break;
        case "bio":
        case "biology":
          subjectURL = getSubjectUrl("biology");
          break;
        case "ess":
        case "earth science":
        case "es":
          subjectURL = getSubjectUrl("ess");
          break;
        case "chem":
        case "chemistry":
          subjectURL = getSubjectUrl("astronomy");
          break;
        case "phys":
        case "physics":
          subjectURL = getSubjectUrl("physics");
          break;
        case "math":
          subjectURL = getSubjectUrl("math");
          break;
        case "energy":
          subjectURL = getSubjectUrl("energy");
          break;
        default:
          message.channel.send("Not a valid subject!");
          return;
      }

      axios
        .get(subjectURL)
        .then((res) => {
          const data = res.data;
          const questionNum = Math.floor(Math.random() * data.length);
          const messageFilter = (m) => m.author.id === authorId;
          message.reply(data[questionNum].tossup_question).then(() => {
            message.channel
              .awaitMessages(messageFilter, {
                max: 1,
                time: 30000,
                errors: ["time"],
              })
              .then((answerMsg) => {
                answerMsg = answerMsg.first();

                let predicted = null;
                if (data[questionNum].tossup_format === "Multiple Choice") {
                  if (
                    answerMsg.content.charAt(0).toLowerCase() ===
                    data[questionNum].tossup_answer.charAt(0).toLowerCase()
                  ) {
                    predicted = "correct";
                  } else {
                    predicted = "incorrect";
                  }
                } else {
                  if (
                    answerMsg.content.toLowerCase() ===
                    data[questionNum].tossup_answer.toLowerCase()
                  ) {
                    predicted = "correct";
                  } else {
                    predicted = "incorrect";
                  }
                }
                answerMsg.channel.send(
                  `Correct answer: **${data[questionNum].tossup_answer}**. Predicted: **${predicted}**. Please react to your answer!`
                );
                answerMsg.react("✅");
                answerMsg.react("❌");
                const reactionFilter = (reaction, user) => {
                  return (
                    ["❌", "✅"].includes(reaction.emoji.name) &&
                    user.id === answerMsg.author.id
                  );
                };
                answerMsg
                  .awaitReactions(reactionFilter, {
                    max: 1,
                    time: 600000,
                    errors: ["time"],
                  })
                  .then(async (userReaction) => {
                    const reaction = userReaction.first();
                    if (reaction.emoji.name == "❌") {
                      updateScore(false, score, authorId).then((msgToReply) =>
                        answerMsg.reply(msgToReply)
                      );
                    } else {
                      updateScore(true, score, authorId).then((msgToReply) =>
                        answerMsg.reply(msgToReply)
                      );
                    }
                  })
                  .catch((collected) => {}); // Reaction message filter
              })
              .catch((collected, error) => {
                message.reply("\n**ANSWER TIMEOUT**");
              });
          });
        })
        .catch(console.error);
    }
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
  let finalizedHTML = '<html><body style="width: 70%; margin-left: auto; margin-right: auto;"><h2 style="text-align: center; text-decoration: underline overline; padding: 7px;">ROUND GENERATED BY AWESOMESCIBO USING THE SCIBOWLDB API</h2>';
  for (i = 1; i < 26; i++) {
    let tossup_question;
    let question_category;
    let tossup_format;
    let tossup_answer;
    let bonus_question;
    let bonus_format;
    let bonus_answer;
    let htmlContent = "";
    await fetch("https://scibowldb.com/api/questions/random")
      .then((response) => response.json())
      .then((data) => {
        tossup_question = data.question.tossup_question;
        tossup_answer = data.question.tossup_answer;
        question_category = data.question.category;
        tossup_format = data.question.tossup_format;
        bonus_question = data.question.bonus_question;
        bonus_answer = data.question.bonus_answer;
        bonus_format = data.question.bonus_format;
        htmlContent = `<br><br><h3 style="text-align: center;"><strong>TOSS-UP</strong></h3>\n<br>` + `${i}) <strong>${question_category}</strong>` + " " + `<em>${tossup_format}</em>` + " " + tossup_question + "<br><br>" + "<strong>ANSWER:</strong> " + tossup_answer + "<br>";
        htmlContent += `<br><br><h3 style="text-align: center;"><strong>BONUS</strong></h3>\n<br>` + `${i}) <strong>${question_category}</strong>` + " " + `<em>${bonus_format}</em>` + " " + bonus_question + "<br><br>" + "<strong>ANSWER:</strong> " + bonus_answer + "<br><br><hr><br>";
        htmlContent = htmlContent.replace(/\n/g, "<br>");
        finalizedHTML += htmlContent;
        if (i === 25) {
          newGeneratedRound = new generatedRound({
            htmlContent: finalizedHTML,
            requestedBy: message.author.id,
          });
          newGeneratedRound.save((err, round) => {
            if (err) {
              console.log(err);
              return;
            }
            message.channel.messages.fetch(generatingMessage.id)
            .then(message => {
              message.edit(`https://api.adawesome.tech/round/${round._id.toString()}`);
            });
      });
    }
    });
  }
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
        <@745063586422063214>
        <@650525101048987649>
      `) // Add more contributors here, first one is Abheek, second one is Tejas
  );
}

client.on("message", async (message) => {
  if (message.author.bot) {
    return;
  }

  const formattedMessage = message.content.toLowerCase().replace(/ /g, "");
  if (formattedMessage.startsWith("dobe")) {
    // Bot prefix is "do be"
    switch (formattedMessage) {
      case "dobehelping": // Display help message
        sendHelpMessage(message);
        break;
      case "doberoundgen": // Generate round publicly
        generateRound(message, false);
        break;
      case "doberoundgendm": // Generate round through DM
        generateRound(message, true);
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
