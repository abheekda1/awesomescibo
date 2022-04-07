"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
function default_1(config) {
    const logger = log4js_1.default.getLogger(config.logger);
    logger.level = 'debug';
    switch (config.level) {
        case 'trace':
            logger.trace(config.content);
            break;
        case 'debug':
            logger.debug(config.content);
            break;
        case 'info':
            logger.info(config.content);
            break;
        case 'warn':
            logger.warn(config.content);
            break;
        case 'error':
            logger.error(config.content);
            break;
        case 'fatal':
            logger.fatal(config.content);
            break;
        default:
            logger.debug(config.content);
            break;
    }
}
exports.default = default_1;
