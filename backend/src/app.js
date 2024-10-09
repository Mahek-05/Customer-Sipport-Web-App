const express = require('express');

const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const { initializeSocketIO } = require('./events/index');
const Routes = require('./routes/index.routes');

const httpServer = createServer(app);
const io = new Server(httpServer);
app.set('io', io);

initializeSocketIO(io);
app.use(express.json());
app.use(morgan('dev'));
app.use('/', Routes);

app.get('/health-check', (req, res) => {
  console.info('Health check passed!');
  res.send('Hello World!');
});
initializeSocketIO(io);

module.exports = httpServer;

