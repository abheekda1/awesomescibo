import mongoose from 'mongoose';

import log from '../helpers/log';
import userScore from '../models/userScore';

export async function updateScore(isCorrect, score, authorId) {
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
			newUserScore.save(err => {
				if (err) {
					log({ logger: 'db', content: `Error creating new user ${authorId} for scoring`, level: 'error' });
				}
				else {
					log({ logger: 'db', content: `Successfully created user ${authorId} for scoring`, level: 'debug' });
				}
			});
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
}

export async function connect(mongoUri) {
	mongoose
		.connect(mongoUri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.then(() => log({ logger: 'db', content: `Connected to the database at ${mongoUri}!`, level: 'info' }))
		.catch(err => log({ logger: 'db', content: `Failed to connect to the database at ${mongoUri}: ${err}`, level: 'fatal' }));
}
