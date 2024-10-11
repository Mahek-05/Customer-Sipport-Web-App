const express = require('express');
const app = express();
const customer = require('./customer.routes');
const agent = require('./agent.routes');
const ticket = require('./ticket.routes');

app.use('/customer-support/customer', customer);
app.use('/customer-support/agent', agent);
app.use('/customer-support/ticket', ticket);

module.exports = app;