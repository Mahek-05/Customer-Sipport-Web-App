const { json } = require('body-parser');
const { errorCodes } = require('../constants/errorCodes');

module.exports.responseHandler = (data, res, httpStatus = 200) => {
  res.status(httpStatus).json({
    data,
  });
};

module.exports.errorHandler = (errorCode, res) => {
  const { httpStatus, message } = errorCodes[errorCode];
  res.status(httpStatus).json({
    code: errorCode,
    message,
  });
};