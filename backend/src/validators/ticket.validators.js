const Joi = require('joi');

exports.createTicketSchema = Joi.object({
  username: Joi.string().required().trim(),
  issueTitle: Joi.string().required().trim().min(3).max(30),
});

exports.updateTicketSchema = Joi.object({
  status: Joi.string().valid('resolved', 'assigned', 'unassigned').required().trim(),
  agentId: Joi.string().trim().allow(null, '').optional(),
});

exports.getTicketSchema = Joi.object({
  username: Joi.string().trim().allow(null, '').optional(),
  status: Joi.string().valid('resolved', 'assigned', 'unassigned').trim().allow(null, '').optional(),
  agentId: Joi.string().trim().allow(null, '').optional(),
  searchText: Joi.string().trim().allow(null, '').optional(),
});