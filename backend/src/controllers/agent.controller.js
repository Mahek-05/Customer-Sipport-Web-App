const agentServices = require('../services/agent.services');
const { asyncHandler } = require('../../lib/helpers/asyncHandler');
const { errorHandler, responseHandler } = require('../../lib/helpers/responseHandler');

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, agentId, email } = req.value;
  const body = {
    firstName,
    lastName: lastName || '',
    agentId,
    email,
  };
  let agent = await agentServices.findOne({
    filter: {
      $or: [
        { agentId },
        { email }
      ]
    },
  });
  if(agent) {
    return errorHandler('ERR-102', res);
  }
  agent = await agentServices.create({ body });
  return responseHandler({ agent }, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { agentId } = req.value;
  const agent = await agentServices.findOne({ filter: { agentId } }); 
  if(!agent) {
    return errorHandler('ERR-101', res);
  }
  return responseHandler({agent}, res);
});