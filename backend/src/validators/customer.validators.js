const Joi = require('joi');

exports.registerSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'First Name is required',
      'string.min': 'First Name must be at least 2 characters',
      'string.max': 'First Name must be less than or equal to 50 characters'
    }),

  lastName: Joi.string()
    .allow(null, '')
    .max(50)
    .messages({
      'string.max': 'Last Name must be less than or equal to 50 characters'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required'
    }),

  username: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'username is required',
      'string.min': 'username must be at least 2 characters',
      'string.max': 'username must be less than or equal to 50 characters'
    }),
});

exports.loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'username is required',
      'string.min': 'username must be at least 2 characters',
      'string.max': 'username must be less than or equal to 50 characters'
    }),
});