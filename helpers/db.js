const mongoose = require('mongoose');

const userScore = require('../models/userScore');

module.exports = {
	async updateScore(isCorrect, score, authorId) {
		if (!isCorrect) {
			return `Nice try! Your score is still ${score}.`;
		}
		else {
			score += 4;
			if (score == 4) {
				const newUserScore = new userScore({
					authorID: authorId,
					score: score,
				});
				newUserScore.save((err) =>
					err
						? console.log('Error creating new user for scoring')
						: console.log('Sucessfully created user to score.'),
				);
			}
			else {
				const doc = await userScore.findOne({
					authorID: authorId,
				});
				doc.score = doc.score + 4;
				doc.save();
			}

			return `Great job! Your score is now ${score}.`;
		}
	},
	async	connect(mongoUri) {
		mongoose
			.connect(mongoUri, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			});
	},
};
