#!/usr/bin/env node

import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, token } from './helpers/env';

const commands : any[] = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	import(`./commands/${file}`)
		.then(command => {
			commands.push(command.data.toJSON());
		})
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
