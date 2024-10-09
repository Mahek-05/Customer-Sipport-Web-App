const { socketEvents } = require('../../lib/constants/socket');

exports.onConnection = async (socket) => {
  try {
    socket.emit(socketEvents.PAIR_SUCCESS, {
      message: 'Successfully connected to the socket.',
      data: {
        userId: socket.userData.userId,
      },
    });
    console.info(`User connected.`);
  } catch (error) {
    console.error('Error occurred while connecting to the socket: ', error.message);
    socket.emit(socketEvents.PAIR_FAILED, {
      message: error.message,
    });
  }
};
