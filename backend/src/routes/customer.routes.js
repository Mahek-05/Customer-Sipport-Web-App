const router = require('express').Router();
const {
  register,
  login,
} = require('../controllers/customer.controller');
const {
  registerSchema,
  loginSchema,
} = require('../validators/customer.validators');
const { validateRequest } = require('../../lib/middlewares/validators.middleware');

router.route('/register').post(validateRequest(registerSchema, 'body'), register);
router.route('/login').post(validateRequest(loginSchema, 'body'), login);

module.exports = router;