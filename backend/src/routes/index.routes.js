const express = require('express');
const app = express();
const customer = require('./customer.routes');
const agent = require('./agent.routes');

app.use('/customer-support/customer', customer);
app.use('/customer-support/agent', agent);

module.exports = app;