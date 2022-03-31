
![logo](https://user-images.githubusercontent.com/67982792/160637166-b8c3a390-e4f9-46d1-8738-dcb2d8b9baa7.png)

<h1 align="center">AwesomeSciBo</h1>


<p align="center">
<a href="https://github.com/ADawesomeguy/AwesomeSciBo/stargazers"><img src="https://img.shields.io/github/stars/ADawesomeguy/AwesomeSciBo?color=blue&style=for-the-badge"></a>
<a href="https://github.com/ADawesomeguy/AwesomeSciBo/network"><img src="https://img.shields.io/github/forks/ADawesomeguy/AwesomeSciBo?style=for-the-badge"></a>
<a href="https://github.com/ADawesomeguy/AwesomeSciBo/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ADawesomeguy/AwesomeSciBo?color=blue&style=for-the-badge"></a>
<a href="https://github.com/ADawesomeguy/AwesomeSciBo/issues"><img src="https://img.shields.io/github/issues/ADawesomeguy/AwesomeSciBo?color=blue&style=for-the-badge"></a>
<a href="https://github.com/CQCumbers/ScibowlDB"><img src="https://img.shields.io/badge/API-ScibowlDB-blue?style=for-the-badge"></a>
<a href="https://hub.docker.com/r/adawesomeguy/awesomescibo"><img src="https://img.shields.io/docker/pulls/adawesomeguy/awesomescibo?color=blue&style=for-the-badge"></a>
</p>

<p align="center">A simple Discord bot that automatically generates Science Bowl rounds using the ScibowlDB API!</p>

## Deployment
Deploying this bot to your Discord server is relatively simple: you can add it to your own server by using [this link](https://adat.link/awesomescibo).

## Contributing
Please see [CONTRIBUTING.md](https://github.com/ADawesomeguy/AwesomeSciBo/blob/master/.github/CONTRIBUTING.md).


## Installation
There are basically two ways to install it:

### Method 1 (Node):  
After cloning the repository, dependencies can be installed with `yarn` or `npm i`. The bot can then be compile to JavaScript with `yarn tsc` or `npx tsc`, and will be deployed in the `built/` directory. Finally, the bot can be run by entering said directory and running `./index.js` or `node index.js`. 

### Method 2 (Docker):  
This bot has a Dockerfile within the repository which can be built using `docker build . -t [tag]`. Alternatively and preferably, the image can be taken from [DockerHub](https://hub.docker.com/r/adawesomeguy/awesomescibo).

## Usage
This bot uses slash commands now :). You can just click on the bot icon after typing `/` to see a list of commands.

## Credit
The bot was made by [@ADawesomeguy](https://github.com/ADawesomeguy). However, the API was made by [@CQCumbers](https://github.com/CQCumbers). Go give [his API](https://github.com/CQCumbers/ScibowlDB) a star, he totally deserves it!
