const httpStatus = require('http-status');
const { MulterError } = require('multer');
const { JsonSchemaValidation } = require('express-jsonschema')

function ApiError({ statusCode = 500, message = '', isOperational = true, stack = '' }) {
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
}


const {
    BadRequestError,
    NotFoundError,
    UpdateFailedError,
} = require('../../utils/api_error_util');
const { logger } = require('../../config');

function errorConverter(err, req, res, next) {
    let error = err;
    logger.info(error, `error.middleware --> errorConverter`);

    if (error instanceof MulterError) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message =
            error.code === 'LIMIT_UNEXPECTED_FILE' ? 'Please provide valid files' : error.message;
        error = new ApiError({ statusCode, message, isOperational: false, stack: error.stack });
    } else if (error instanceof JsonSchemaValidation) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message = error.message;
        error = new ApiError({ statusCode, message, isOperational: true, stack: error.validations.body.length && error.validations.body[0].messages || [] });
    } else if (
        !(
            error instanceof ApiError ||
            error instanceof BadRequestError ||
            error instanceof NotFoundError ||
            error instanceof UpdateFailedError
        )
    ) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError({ statusCode, message, isOperational: false, stack: err.stack });
    }
    next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    let { statusCode, message } = err;
    if (!err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        success: false,
        code: statusCode,
        message,
        ...({ stack: err.stack }),
    };

    res.status(statusCode).send(response);
}

module.exports = {
    errorConverter,
    errorHandler,
};