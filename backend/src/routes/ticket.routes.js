const router = require('express').Router();
const {
  createTicket,
  updateTicket,
  getTicket,
} = require('../controllers/ticket.controller');
const {
  createTicketSchema,
  updateTicketSchema,
  getTicketSchema,
} = require('../validators/ticket.validators');
const { validateRequest } = require('../../lib/middlewares/validators.middleware');

router.route('/').post(validateRequest(createTicketSchema, 'body'), createTicket);
router.route('/:ticketId').put(validateRequest(updateTicketSchema, 'body'), updateTicket);
router.route('/').get(validateRequest(getTicketSchema, 'query'), getTicket);

module.exports = router;