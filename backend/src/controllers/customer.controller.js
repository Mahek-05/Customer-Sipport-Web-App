const customerServices = require('../services/customer.services');
const { asyncHandler } = require('../../lib/helpers/asyncHandler');
const { errorHandler, responseHandler } = require('../../lib/helpers/responseHandler');
const { findOne, create } = require('../models/customer.model');

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email } = req.value;
  const body = {
    firstName,
    lastName: lastName || '',
    username,
    email,
  };
  let customer = await customerServices.findOne({
    filter: {
      $or: [
        { username },
        { email }
      ]
    },
  });
  if(customer) {
    return errorHandler('ERR-102', res);
  }
  customer = await customerServices.create({ body });
  return responseHandler({ customer }, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { username } = req.value;
  const customer = await customerServices.findOne({ filter: { username } }); 
  if(!customer) {
    return errorHandler('ERR-101', res);
  }
  return responseHandler({customer}, res);
});