import mongoose from 'mongoose';

const userConfigSchema = new mongoose.Schema({
	authorID: {
		type: String,
		required: true,
	},
	subjects: {
		type: [String],
		required: false,
		default: null,
	},
	gradeLevels: {
		type: [String],
		required: false,
		default: null,
	},
});

export default mongoose.model('UserConfig', userConfigSchema);
