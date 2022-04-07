"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.updateScore = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = __importDefault(require("../helpers/log"));
const userScore_1 = __importDefault(require("../models/userScore"));
function updateScore(isCorrect, score, authorId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isCorrect) {
            return `Nice try! Your score is still ${score}.`;
        }
        else {
            // TODO: Error handling
            const doc = yield userScore_1.default.findOne({
                authorID: authorId,
            });
            if (!doc) {
                const newUserScore = new userScore_1.default({
                    authorID: authorId,
                    score: score + 4,
                });
                newUserScore.save(err => {
                    if (err) {
                        (0, log_1.default)({ logger: 'db', content: `Error creating new user ${authorId} for scoring`, level: 'error' });
                    }
                    else {
                        (0, log_1.default)({ logger: 'db', content: `Successfully created user ${authorId} for scoring`, level: 'debug' });
                    }
                });
            }
            else {
                doc.score = doc.score + 4;
                doc.save();
            }
            return `Great job! Your score is now ${score + 4}.`;
        }
    });
}
exports.updateScore = updateScore;
function connect(mongoUri) {
    return __awaiter(this, void 0, void 0, function* () {
        mongoose_1.default
            .connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
            .then(() => (0, log_1.default)({ logger: 'db', content: `Connected to the database at ${mongoUri}!`, level: 'info' }))
            .catch(err => (0, log_1.default)({ logger: 'db', content: `Failed to connect to the database at ${mongoUri}: ${err}`, level: 'fatal' }));
    });
}
exports.connect = connect;
