import mongoose from "mongoose";

const userScoreSchema = new mongoose.Schema({
  authorID: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("UserScore", userScoreSchema);
