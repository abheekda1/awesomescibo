const mongoose = require("mongoose");

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

module.exports = mongoose.model("UserScore", userScoreSchema);
