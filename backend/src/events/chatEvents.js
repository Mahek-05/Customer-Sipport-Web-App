const { socketEvents } = require('../../lib/constants/socket');
const ticketServices = require('../services/ticket.services');
const messageServices = require('../services/message.services');
const customerServices = require('../services/customer.services');
const agentServices = require('../services/agent.services');


exports.joinRoom = (socket) => {
  socket.on(socketEvents.JOIN_ROOM, async (data) => {
    try {
      console.info('joinRoom event listened');
      const {  } = socket.userData;
      const { ticketId } = data;

      if (!hashtagId || !userId) {
        throw new Error('Invalid data sent.');
      }

      const chatroom = await chatroomServices.findOne({
        filter: { hashtagId },
        projection: { _id: 1, parentChatroomId: 1 },
      });

      if (!chatroom) {
        throw new Error('Chatroom not found');
      }

      const { parentChatroomId, _id: chatroomId } = chatroom;
      const isParentChatroom = !parentChatroomId;

      // const user = await participantServices.findOne({
      //   filter: { userId, chatroomId },
      // });

      // comment this and uncomment the above lines
      // if you want to check user's presence as a participant in the chatroom
      const user = await participantServices.findOneAndUpsert({
        filter: { userId, chatroomId },
        body: { userId, chatroomId },
      });

      if (!user) {
        throw new Error('Couldnt find or create user in the chatroom');
      }

      socket.join(hashtagId);

      socket.to(hashtagId).emit(socketEvents.USER_JOINED, {
        user,
        message: `User ${userId} has joined the chatroom.`,
      });

      const aggregationPipeline = [
        {
          $match: {
            chatroomId: isParentChatroom
              ? {
                $in: await chatroomServices.find({
                  filter: { $or: [{ _id: chatroomId }, { parentChatroomId: chatroomId }] },
                  projection: { _id: 1 },
                }).then((chatrooms) => chatrooms.map(({ _id }) => _id)),
              }
              : chatroomId,
          },
        },
        {
          $facet: {
            messages: [
              {
                $sort: { createdAt: -1 },
              },
              {
                $skip: (page - 1) * limit,
              },
              {
                $limit: parseInt(limit, 10),
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'senderId',
                  foreignField: '_id',
                  as: 'senderDetails',
                  pipeline: [
                    { $project: { userName: 1, fullName: 1, profilePicture: 1 } },
                  ],
                },
              },
              {
                $unwind: {
                  path: '$senderDetails',
                  preserveNullAndEmptyArrays: false,
                },
              },
              {
                $project: {
                  _id: 1,
                  content: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  senderDetails: {
                    _id: '$senderDetails._id',
                    userName: '$senderDetails.userName',
                    fullName: '$senderDetails.fullName',
                    profilePicture: '$senderDetails.profilePicture',
                  },
                },
              },
            ],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ];

      // Execute the aggregation
      const result = await messageServices.aggregate({ query: aggregationPipeline });
      const messages = result[0].messages || [];
      const totalMessages = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;

      // Calculate total pages
      const totalPages = Math.ceil(totalMessages / limit);

      socket.emit(socketEvents.MESSAGE_HISTORY, {
        chatroomId,
        metadata: {
          totalMessages,
          totalPages,
          page,
          limit,
        },
        messages,
      });
    } catch (error) {
      socket.emit(socketEvents.JOIN_ROOM_FAILED, {
        message: error.message,
      });
    }
  });
};

exports.sendMessage = async (socket) => {
  socket.on(socketEvents.SEND_MESSAGE, async (data) => {
    try {
      const { userId } = socket.userData;
      const { hashtagId, content } = data;

      if (!hashtagId || !userId || !content) {
        throw new Error('Invalid data sent.');
      }

      const chatroom = await chatroomServices.findOne({ filter: { hashtagId } });
      if (!chatroom) {
        throw new Error('Chatroom not found');
      }

      const { _id: chatroomId } = chatroom;

      const message = await messageServices.create({
        body: { senderId: userId, chatroomId, content },
      });

      // Populate sender details from the users collection
      const senderDetails = await userServices.findOne({
        filter: { _id: userId },
        projection: {
          _id: 1, userName: 1, fullName: 1, profilePicture: 1,
        },
      });

      const { _id: id } = message;

      // Combine message and sender details
      const newMessage = {
        chatroomId: message.chatroomId,
        content: message.content,
        _id: id,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        senderDetails,
      };

      // Emit the new message to all other participants in the chatroom
      socket.to(hashtagId).emit(socketEvents.NEW_MESSAGE, {
        newMessage,
      });

      socket.emit(socketEvents.SEND_MESSAGE_SUCCESS, {
        message: 'Message sent successfully.',
        newMessage,
      });
    } catch (error) {
      socket.emit(socketEvents.SEND_MESSAGE_FAILED, {
        message: error.message,
      });
    }
  });
};
