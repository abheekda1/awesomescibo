import mongoose from 'mongoose';

const userConfigSchema = new mongoose.Schema({
    _id: String,
    subjects: {
        type: [String],
        required: true,
        default: null,
    },
    gradeLevels: {
        type: [String],
        required: true,
        default: null,
    },
});

export default mongoose.model('UserConfig', userConfigSchema);
