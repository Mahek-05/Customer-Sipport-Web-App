const { onConnection } = require('./onConnection');
const { socketEvents } = require('../../lib/constants/socket');
const ticketServices = require('../services/ticket.services');
const messageServices = require('../services/message.services');
const customerServices = require('../services/customer.services');
const agentServices = require('../services/agent.services');

exports.initializeSocketIO = (io) => {
  io.on(socketEvents.CONNECTION, (socket) => {
    try {
      onConnection(socket);
      
      // Handle customer joining
      socket.removeAllListeners(socketEvents.CUSTOMER_JOIN);
      socket.on(socketEvents.CUSTOMER_JOIN, async ({ ticketId }) => {
        const username = socket.customerData.username;
        console.info(`Customer ${username} requested to join room ${ticketId}`);
        
        socket.join(ticketId); // Customer joins the room identified by ticketId

        const ticket = await ticketServices.findById({ id: ticketId }); 

        // Fetch message history for this ticketId
        const messageHistory = await messageServices.find({ filter: { ticketId}, sort: { createdAt: -1 } });

        // Send message history to the customer
        socket.emit(socketEvents.MESSAGE_HISTORY, messageHistory);

        // Notify others in the room that the customer has joined
        socket.to(ticketId).emit(socketEvents.CUSTOMER_JOINED, { username , ticket });
      });

      // Handle agent joining
      socket.removeAllListeners(socketEvents.AGENT_JOIN);
      socket.on(socketEvents.AGENT_JOIN, async ({ ticketId }) => {
          const agentId = socket.agentData.agentId; 
          socket.join(ticketId);
          // Check who is in the room before emitting the event
          io.in(ticketId).allSockets().then(sockets => {
            console.info(`Sockets in room after agent join ${ticketId}:`, sockets);
          });
          console.info(`Agent ${agentId} joined room ${ticketId}`);

          const ticket = await ticketServices.findById({ id: ticketId }); 

          // Fetch message history for this ticketId
          const messageHistory = await messageServices.find({ filter: { ticketId}, sort: { createdAt: -1 } });

          // Send message history to the agent
          socket.emit(socketEvents.MESSAGE_HISTORY, { ticket, messageHistory });

          if (ticket.agentId && ticket.agentId === agentId) {
            // Notify others in the room that the agent has joined
            socket.to(ticketId).emit(socketEvents.AGENT_JOINED, { agentId , ticket });
            console.info(`Agent ${agentId} owns room ${ticketId}`);
          }
      });

      socket.removeAllListeners(socketEvents.SEND_MESSAGE);
      socket.on(socketEvents.SEND_MESSAGE, async ({ content, ticketId }) => {
        // Check who is in the room before emitting the event
        io.in(ticketId).allSockets().then(sockets => {
          console.info(`Sockets in room  after send message ${ticketId}:`, sockets);
        });
        console.info(`Message received in room ${ticketId}`);
        const ticket = await ticketServices.findById({ id: ticketId });
        if(socket.agentData && ticket.agentId && ticket.agentId === socket.agentData.agentId && ticket.status !== 'unassigned') {    
          await messageServices.create({ body: {
            content,
            agentId: socket.agentData.agentId,
            sender: 'agent',
            ticketId,
          }});
          // Emit the message to everyone in the room
          socket.to(ticketId).emit(socketEvents.RECEIVE_MESSAGE, { agentId: socket.agentData.agentId , content });
        } else if (socket.customerData) {
            await messageServices.create({ body: {
              content,
              username: socket.customerData.username,
              sender: 'customer',
              ticketId,
            }});

            // Emit the message to everyone in the room
            socket.to(ticketId).emit(socketEvents.RECEIVE_MESSAGE, { username: socket.customerData.username , content });
        } else {
          console.error('Invalid user trying to send message');
        }

      });

      // // Handle agent leaving the room
      // socket.on(socketEvents.AGENT_LEAVE, ({ agentId, ticketId }) => {
      //   console.info(`Agent ${agentId} left room ${ticketId}`);

      //   if (activeAgents[ticketId] === agentId) {
      //     // If the agent leaving is the active agent in the room, remove them
      //     delete activeAgents[ticketId];
      //     socket.leave(ticketId);
      //     socket.to(ticketId).emit(socketEvents.AGENT_LEFT, { agentId });
      //   }
      // });

      socket.on(socketEvents.DISCONNECT, () => {
        console.info(`User disconnected.`);
      });
    } catch (error) {
      socket.emit(
        socketEvents.PAIR_FAILED,
        error && error.message ? error.message : 'Something went wrong while connecting to the socket.',
      );
    }
  });
};



