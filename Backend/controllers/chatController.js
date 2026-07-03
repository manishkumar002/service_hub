const Conversation = require("../models/conversation");
const Message = require("../models/message");
const ErrorHandler = require("../utils/errorHandler");

// send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return next(new ErrorHandler("Conversation not found", 404));
    }

    // only client/provider can chat
    const isAllowed =
      conversation.clientId.toString() === req.user._id.toString() ||
      conversation.providerId.toString() === req.user._id.toString();

    if (!isAllowed) {
      return next(
        new ErrorHandler("You are not allowed in this conversation", 403),
      );
    }

    const newMessage = await Message.create({
      conversationId,
      senderId: req.user._id,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// get conversation messages
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    })
      .populate("senderId", "fullName email profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// my conversations
exports.getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ clientId: req.user._id }, { providerId: req.user._id }],
    })
      .populate("clientId", "fullName email profileImage")
      .populate("providerId", "fullName email profileImage")
      .populate("jobId", "title status");

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};
