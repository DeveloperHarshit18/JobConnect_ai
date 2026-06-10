const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message
    });

    const populated = await Message.findById(newMessage._id)
      .populate('senderId', 'name profilePicture')
      .populate('receiverId', 'name profilePicture');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages between two users
// @route   GET /api/messages/:userId
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    })
      .populate('senderId', 'name profilePicture')
      .populate('receiverId', 'name profilePicture')
      .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get conversation list (unique users who have chatted)
// @route   GET /api/messages/conversations/list
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversation partners
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId']
          },
          lastMessage: { $first: '$message' },
          lastMessageAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$read', false] }] },
                1, 0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageAt: -1 } }
    ]);

    // Populate user details
    const conversations = await User.populate(messages, {
      path: '_id',
      select: 'name email profilePicture role'
    });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
