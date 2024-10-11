const { onConnection } = require('./onConnection');
const { socketEvents } = require('../../lib/constants/socket');
const { on, emit } = require('nodemon');
const activeAgents = {};

exports.initializeSocketIO = (io) => {
  io.on(socketEvents.CONNECTION, (socket) => {
    try {
      onConnection(socket);
      
      // Handle customer joining
      socket.on(socketEvents.CUSTOMER_JOIN, async ({ username, ticketId }) => {
        console.info(`Customer ${username} joined room ${ticketId}`);
        
        socket.join(ticketId); // Customer joins the room identified by ticketId

        // Fetch message history for this ticketId
        const messageHistory = await messageServices.find({ filter: { ticketId} });

        // Send message history to the customer
        socket.emit(socketEvents.MESSAGE_HISTORY, messageHistory);
      });

      // Handle agent joining
      socket.on(socketEvents.AGENT_JOIN, async ({ agentId, ticketId }) => {
        console.info(`Agent ${agentId} attempting to join room ${ticketId}`);

        if (activeAgents[ticketId]) {
          // If there is already an agent in the room, prevent this agent from joining
          socket.emit(socketEvents.AGENT_DENIED, { message: 'Another agent is already in this room.' });
        } else {
          // No agent in the room, allow this agent to join
          activeAgents[ticketId] = agentId;
          socket.join(ticketId);
          console.info(`Agent ${agentId} joined room ${ticketId}`);

          // Fetch message history for this ticketId
          const messageHistory = await messageServices.getMessageHistory(ticketId);

          // Send message history to the agent
          socket.emit(socketEvents.MESSAGE_HISTORY, messageHistory);

          // Notify others in the room that the agent has joined
          socket.to(ticketId).emit(socketEvents.AGENT_JOINED, { agentId });
        }
      });

      // Handle sending messages (customer or agent)
      socket.on(socketEvents.SEND_MESSAGE, async ({ ticketId, senderId, message }) => {
        console.info(`Message received in room ${ticketId} from ${senderId}`);

        // Save the message to the database
        await messageServices.saveMessage({
          ticketId,
          senderId,
          message,
          timestamp: new Date(),
        });

        // Emit the message to everyone in the room
        socket.to(ticketId).emit(socketEvents.RECEIVE_MESSAGE, { senderId, message });
      });

      // Handle agent leaving the room
      socket.on(socketEvents.AGENT_LEAVE, ({ agentId, ticketId }) => {
        console.info(`Agent ${agentId} left room ${ticketId}`);

        if (activeAgents[ticketId] === agentId) {
          // If the agent leaving is the active agent in the room, remove them
          delete activeAgents[ticketId];
          socket.leave(ticketId);
          socket.to(ticketId).emit(socketEvents.AGENT_LEFT, { agentId });
        }
      });

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



