const mongoose = require('mongoose');

const { log } = require('../helpers/log.js');
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
				// TODO: Error handling
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
			})
			.then(() => log({ logger: 'db', content: `Connected to the database at ${mongoUri}!`, level: 'info' }))
			.catch(err => log({ logger: 'db', content: `Failed to connect to the database at ${mongoUri}: ${err}`, level: 'fatal' }));
	},
};
