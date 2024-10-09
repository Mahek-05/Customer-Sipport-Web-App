const { onConnection } = require('./onConnection');
const { socketEvents } = require('../../lib/constants/socket');

exports.initializeSocketIO = (io) => {
  io.on(socketEvents.CONNECTION, (socket) => {
    try {
      onConnection(socket);
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



