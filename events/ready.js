const db = require('../helpers/db');
const { mongoUri } = require('../helpers/env');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await db.connect(mongoUri);
		console.log(`Logged in at ${client.user.tag}!`);
	},
};
