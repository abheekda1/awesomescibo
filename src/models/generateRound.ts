import mongoose from 'mongoose';

const generatedRoundSchema = new mongoose.Schema({
	htmlContent: {
		type: String,
		required: true,
	},
	requestedBy: {
		type: String,
		required: true,
	},
	authorTag: {
		type: String,
		required: true,
	},
	timestamp: {
		type: String,
		required: true,
	},
});

export default mongoose.model('GeneratedRounds', generatedRoundSchema);
