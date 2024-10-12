const express = require('express');
const cors = require('cors');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const { initializeSocketIO } = require('./events/index');
const Routes = require('./routes/index.routes');

// Create HTTP server
const httpServer = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URI || 'http://localhost:5173', 
    credentials: true 
  }
});

app.set('io', io);

app.use(cors({
  origin: '*', // Adjust if you need stricter rules
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'agentid','username'], 
}));

app.options('*', cors()); 

initializeSocketIO(io);

// Express middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', Routes);

// Health check route
app.get('/health-check', cors(), (req, res) => {
  console.info('Health check passed!');
  res.send('Hello World!');
});

module.exports = httpServer;