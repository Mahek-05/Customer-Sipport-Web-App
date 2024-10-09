const commonError = {
  'ERR-001': {
    httpStatus: 400,
    message: 'Missing data in request',
  },
  'ERR-004': {
    httpStatus: 500,
    message: 'Server Error. Please try later',
  },
};

exports.errorCodes = {
  ...commonError,
};
