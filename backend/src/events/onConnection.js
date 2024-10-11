const { socketEvents } = require('../../lib/constants/socket');
const ticketServices = require('../services/ticket.services');
const messageServices = require('../services/message.services');
const customerServices = require('../services/customer.services');
const agentServices = require('../services/agent.services');

exports.onConnection = async (socket) => {
  try {
    if (socket?.handshake?.headers?.agentid) {
      const { agentid } = socket.handshake.headers;
      const agent = await agentServices.findOne({ filter: { agentId: agentid }})
      socket.agentData = agent ;
      console.info(`Agent connected with agentId: ${socket.agentData.agentId}`);
    } else if (socket?.handshake?.headers?.username) {
      const { username } = socket.handshake.headers;
      const customer = await customerServices.findOne({ filter: { username }})
      socket.customerData = customer;
      console.info(`Customer connected with username: ${socket.customerData.username}`);
    } else {
      console.error('Invalid connection request.');
      return;
    }

    socket.emit(socketEvents.PAIR_SUCCESS, {
      message: 'Successfully connected to the socket.',
    });
  } catch (error) {
    console.error('Error occurred while connecting to the socket: ', error.message);
    socket.emit(socketEvents.PAIR_FAILED, {
      message: error.message,
    });
  }
};
