const winston = require('winston');
const path = require('path');

const errorLogger = winston.createLogger({
	level: 'error',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, '..', 'logs', 'error.log')
		})
	]
});

const infoLogger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, '..', 'logs', 'info.log')
		})
	]
});

module.exports = {
	error: errorLogger.error.bind(errorLogger),
	info: infoLogger.info.bind(infoLogger)
};
