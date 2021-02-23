# AwesomeSciBo

[![GitHub stars](https://img.shields.io/github/stars/ADawesomeguy/AwesomeSciBo?color=blue&style=for-the-badge)](https://github.com/ADawesomeguy/AwesomeSciBo/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ADawesomeguy/AwesomeSciBo?style=for-the-badge)](https://github.com/ADawesomeguy/AwesomeSciBo/network)
[![GitHub license](https://img.shields.io/github/license/ADawesomeguy/AwesomeSciBo?color=blue&style=for-the-badge)](https://github.com/ADawesomeguy/AwesomeSciBo/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ADawesomeguy/AwesomeSciBo?color=blue&style=for-the-badge)](https://github.com/ADawesomeguy/AwesomeSciBo/issues)
[![API](https://img.shields.io/badge/API-ScibowlDB-blue?style=for-the-badge)](https://github.com/CQCumbers/ScibowlDB)

A simple Discord bot that automatically generates Science Bowl rounds using the ScibowlDB API!

## Deployment
Deploying this bot to your Discord server is relatively simple: you can add it to your own server by using [this link](http://scibot.adawesome.tech/).

## Contributing
If you want to make a contribution to this bot, please make a [Pull Request](https://github.com/ADawesomeguy/AwesomeSciBo/pulls) with as much detail as you can. I'll take a look in my free time and see if it's worth adding. If not, I'll let you know what to do to *make* it worth adding!

## Installation
There are a couple steps to installing this bot on your own server.
1) Clone repo:
```
git clone https://github.com/ADawesomeguy/AwesomeSciBo.git
```
2) Enter repo and install dependencies
```
cd AwesomeSciBo/bot && npm i
```
3) Create your own application and bot using the [Discord Developer Portal](https://discord.com/developers) and add your bot token to the `roundbot.mjs` file. You can find the bot token in the `Bot` section of your application:

    ![](images/discord-developer.png)

4) Run your bot:
```
node roundbot.mjs
```

## Credit
The bot was made by [@ADawesomeguy](https://github.com/ADawesomeguy). However, the API was made by [@CQCumber](https://github.com/CQCumber). Go give [his API](https://github.com/CQCumbers/ScibowlDB) a star, he totally deserves it!
