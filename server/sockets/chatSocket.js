// Socket.io Chat Handler
const Message = require('../models/Message');

const setupSocket = (io) => {
  // Track online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins with their userId
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log(`User ${userId} is online`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, receiverId, message } = data;

        // Save message to database
        const newMessage = await Message.create({
          senderId,
          receiverId,
          message
        });

        const populated = await Message.findById(newMessage._id)
          .populate('senderId', 'name profilePicture')
          .populate('receiverId', 'name profilePicture');

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', populated);
        }

        // Confirm to sender
        socket.emit('messageSent', populated);
      } catch (error) {
        socket.emit('messageError', { error: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', { userId: senderId });
      }
    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userStopTyping', { userId: senderId });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
