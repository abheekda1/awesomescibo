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
There are two ways to install this on your own server: using npm and cloning this repository.

> Note: make sure you have `node` installed  on your system. This varies from computer to computer, but make sure you have the right version installed. Generally, versions older than 12.X don't work properly.

### *RECOMMENDED*
### Option 1: NPM
#### Steps
1) Install the package with npm
```
sudo npm i -g awscibo
```
2) Run the command (learn how to get your token [here](https://github.com/ADawesomeguy/AwesomeSciBo/blob/master/README.md#Notes))
```
awscibo [your token here]
```

### Option 2: Clone repository
#### Steps
1) Clone repo:
```
git clone https://github.com/ADawesomeguy/AwesomeSciBo.git
```
2) Enter repo and install dependencies
```
cd AwesomeSciBo/bot && npm i
```

3) Run your bot:
```
node awesomescibo.mjs
```

### Option 3: Dockerfile
#### Steps
1) Clone repo
```
git clone https://github.com/ADawesomeguy/AwesomeSciBo.git
```
2) Enter repo, build, and run Docker image
```
cd AwesomeSciBo
docker build -t awscibo .
docker run -e BOT_TOKEN=[your bot token here] --name awscibo -d awscibo
```
## Usage
To get started, run the command `do be helping` to get a list of commands. The more helpful commands will be the ones that generate packets, which are `do be roundgen pdf/html` and `do be roundgen pdf/html dm`.

> Note: if you plan to use PDF files, you must have `gotenberg` installed and running at `localhost:3136` (or change the `awesomescibo.mjs` script to point to a different location). You can find more info about that [here](https://github.com/thecodingmachine/gotenberg).

## Notes
### Creating a Discord Application/Bot
To create your own application and bot using the [Discord Developer Portal](https://discord.com/developers), go to the previous link and sign in. Then create a new application, and click bots on the left. Configure it to your liking, and then copy the token.

   ![](images/discord-developer.png)

That's the most important part of your bot *and don't share it with anyone*.

## Credit
The bot was made by [@ADawesomeguy](https://github.com/ADawesomeguy). However, the API was made by [@CQCumbers](https://github.com/CQCumbers). Go give [his API](https://github.com/CQCumbers/ScibowlDB) a star, he totally deserves it!
