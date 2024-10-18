const { MongoError } = require('mongodb');
const { errorHandler } = require('./responseHandler');
const { errorCodes } = require('../constants/errorCodes');
const dal = require('../dal/dal');

exports.asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
    return undefined;
  } catch (error) {
    console.error(error);
    console.error(
      `${(req.user && req.user.id) || 'common'} - ${error.message} - ${
        errorCodes[error.message] ? errorCodes[error.message].message : 'Unknown Error'
      }`,
    );
    if (error instanceof MongoError && error.code === 11000) {
      return errorHandler('ERR-101', res);
    }
    if (errorCodes[error.message]) return errorHandler(error.message, res);
    errorHandler('ERR-004', res);
    return undefined;
  }
};