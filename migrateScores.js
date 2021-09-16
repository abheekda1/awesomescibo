const fs = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dirName = "userScore";

const fileNames = fs.readdirSync(dirName);

const userScoreSchema = new Schema({
  authorID: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const userScore = mongoose.model("UserScore", userScoreSchema);

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    fileNames.forEach(file => {
      fs.readFile(dirName +  "/" + file, 'utf-8', (err, content) => {
        const migrateScore = new userScore({
          authorID: file,
          score: content,
        });
        migrateScore.save();
      });
    });
  })
  .catch((err) => console.log(err));
