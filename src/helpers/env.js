"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoUri = exports.token = exports.testingGuild = exports.clientId = void 0;
require("dotenv/config");
exports.clientId = process.env.CLIENT_ID || '';
exports.testingGuild = process.env.TESTING_GUILD || '';
exports.token = process.env.TOKEN || '';
exports.mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
