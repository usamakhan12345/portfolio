const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      default: 'default-session',
      index: true
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
