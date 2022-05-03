
var winston = require('winston'),
    DailyRotateFile = require('winston-daily-rotate-file'),
    fs = require('fs'),
    path = require('path'),
    initLogger;
/*function customFileFormatter (options) {
    // Return string will be passed to logger.
    return new Date() +' ['+ options.level.toUpperCase() +'] '+ (undefined !== options.message ? options.message : '') +
        (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}*/

initLogger = function () {

    const logDir = 'log';

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    winston.transports.DailyRotateFile = DailyRotateFile;

    var logLevel = (process.env.NODE_ENV == 'production') ? 'error' : 'debug';

    var logger = winston.createLogger({
        
        level: logLevel,
        exceptionHandlers: [
            new (winston.transports.DailyRotateFile)({ filename: path.resolve('./' + logDir + '/exceptions.log'), humanReadableUnhandledException: true, maxsize: 1024 * 1024 * 5 })
        ],
        transports: [
            new (winston.transports.DailyRotateFile)({ filename: path.resolve('./' + logDir + '/all-logs.log'), maxsize: 1024 * 1024 * 5 }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: true,
                colorize: true,
                timestamp: true
            })
        ],
        exitOnError: false
    });

    return logger;

}

module.exports = initLogger();