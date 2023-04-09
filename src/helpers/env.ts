import 'dotenv/config';

export const clientId = process.env.CLIENT_ID || '';
export const testingGuild = process.env.TESTING_GUILD || '';
export const token = process.env.TOKEN || '';
export const mongoUri =
	process.env.MONGO_URI || 'mongodb://mongo:27017/AWESOME';
