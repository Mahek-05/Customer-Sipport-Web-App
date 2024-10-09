const { responseHandler, errorHandler } = require('../helpers/responseHandler');

const defaults = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

exports.validateRequest = (schema, source) => (req, res, next) => {
  if (!source || (source !== 'body' && source !== 'query' && source !== 'params')) return errorHandler('ERR-004', res);
  const { error, value } = schema.validate(req[source], defaults);
  if (error) {
    console.error(error.details[0].message);
    return responseHandler(error.details[0].message, res, 400);
    // return errorHandler("ERR-001", res);
  }
  req.value = value;
  next();
  return undefined;
};