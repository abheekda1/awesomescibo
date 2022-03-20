const db = require('../helpers/db');
const { mongoUri } = require('../helpers/env');
const { log } = require('../helpers/log');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await db.connect(mongoUri);
		log({ logger: 'status', content: `Logged in at ${client.user.tag}!`, level: 'info' });
	},
};
