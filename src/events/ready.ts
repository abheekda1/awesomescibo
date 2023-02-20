import * as db from '../helpers/db';
import { mongoUri } from '../helpers/env';
import log from '../helpers/log';

export const name = 'ready';

export const once = true;

export async function execute(client) {
	await db.connect(mongoUri);
	log({
		logger: 'status',
		content: `Logged in as ${client.user.tag}!`,
		level: 'info',
	});
	client.user.setActivity('for /help', { type: 'WATCHING' });
}
