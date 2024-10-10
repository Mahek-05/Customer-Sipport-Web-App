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
  'ERR-101': {
    httpStatus: 404,
    message: 'Not Found.',
  },
  'ERR-102': {
    httpStatus: 404,
    message: 'username/agentId or email already exists.',
  },
};
