const { onConnection } = require('./onConnection');
const { socketEvents } = require('../../lib/constants/socket');
const ticketServices = require('../services/ticket.services');
const messageServices = require('../services/message.services');
const customerServices = require('../services/customer.services');
const agentServices = require('../services/agent.services');
const assignedTickets = {};

exports.initializeSocketIO = (io) => {
  io.on(socketEvents.CONNECTION, (socket) => {
    try {
      onConnection(socket);
      
      // Handle customer joining
      socket.removeAllListeners(socketEvents.CUSTOMER_JOIN);
      socket.on(socketEvents.CUSTOMER_JOIN, async ({ ticketId }) => {
        console.info(`Customer ${socket.customerData.username} requested to join room ${ticketId}`);
        
        socket.join(ticketId); // Customer joins the room identified by ticketId

        // Fetch message history for this ticketId
        const messageHistory = await messageServices.find({ filter: { ticketId}, sort: { createdAt: -1 } });

        // Send message history to the customer
        socket.emit(socketEvents.MESSAGE_HISTORY, messageHistory);

        // Notify others in the room that the agent has joined
        socket.to(ticketId).emit(socketEvents.CUSTOMER_JOINED, socket.customerData.username);
      });

      // Handle agent joining
      socket.removeAllListeners(socketEvents.AGENT_VIEW_CHAT);
      socket.on(socketEvents.AGENT_VIEW_CHAT, async ({ ticketId }) => {
          socket.join(ticketId);
          console.info(`Agent ${socket.agentData.agentId} is viewing room ${ticketId}`);

          // Fetch message history for this ticketId
          const messageHistory = await messageServices.find({ filter: { ticketId}, sort: { createdAt: -1 } });

          // Send message history to the agent
          socket.emit(socketEvents.MESSAGE_HISTORY, messageHistory);
      });

      // socket.removeAllListeners(socketEvents.AGENT_ASSIGN);
      // socket.on(socket)

//       socket.on(socketEvents.AGENT_SEND_MESSAGE, async ({ ticketId, sender, content,    }) => {
//         console.info(`Message received in room ${ticketId} from ${senderId}`);


//         // Save the message to the database
//         await messageServices.create({

//         });
// //
//         // Emit the message to everyone in the room
//         socket.to(ticketId).emit(socketEvents.RECEIVE_MESSAGE, { senderId, message });
//       });

//       // Handle sending messages (customer or agent)
//       socket.on(socketEvents.AGENT_SEND_MESSAGE, async ({ ticketId, sender, content,    }) => {
//         console.info(`Message received in room ${ticketId} from ${senderId}`);


//         // Save the message to the database
//         await messageServices.create({

//         });

//         // Emit the message to everyone in the room
//         socket.to(ticketId).emit(socketEvents.RECEIVE_MESSAGE, { senderId, message });
//       });

//       // Handle agent leaving the room
//       socket.on(socketEvents.AGENT_LEAVE, ({ agentId, ticketId }) => {
//         console.info(`Agent ${agentId} left room ${ticketId}`);

//         if (activeAgents[ticketId] === agentId) {
//           // If the agent leaving is the active agent in the room, remove them
//           delete activeAgents[ticketId];
//           socket.leave(ticketId);
//           socket.to(ticketId).emit(socketEvents.AGENT_LEFT, { agentId });
//         }
//       });

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

exports.emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get('io').in(roomId).emit(event, payload);
};



