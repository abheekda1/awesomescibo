require('dotenv').config();

module.exports = {
	clientId: process.env.CLIENT_ID,
	testingGuild: process.env.TESTING_GUILD,
	token: process.env.TOKEN,
	mongoUri: process.env.MONGO_URI,
};
