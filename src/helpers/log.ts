import log4js from 'log4js';

export default function (config) {
	const logger = log4js.getLogger(config.logger);
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
