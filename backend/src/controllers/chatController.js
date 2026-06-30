const ChatMessage = require('../models/ChatMessage');
const { retrieveContext } = require('../rag/retrieval.service');
const { generateResponse } = require('../rag/llm.service');

// In-memory fallback history if MongoDB is not available
const inMemoryHistory = {};

/**
 * Handle POST /api/chat
 * Body: { message, sessionId }
 */
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId = 'default-session' } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message content is required.' });
    }

    console.log(`[ChatController] Processing message in session: ${sessionId}`);

    // 1. Retrieve matching context blocks using RAG service
    const context = await retrieveContext(message);

    // 2. Query LLM generator with context
    const reply = await generateResponse(message, context);

    // Check database connection state
    const isDBConnected = require('mongoose').connection.readyState === 1;

    if (isDBConnected) {
      // Save Chat messages to database
      await ChatMessage.create({ sessionId, sender: 'user', message });
      await ChatMessage.create({ sessionId, sender: 'bot', message: reply });
    } else {
      // In-memory fallback
      if (!inMemoryHistory[sessionId]) {
        inMemoryHistory[sessionId] = [];
      }
      inMemoryHistory[sessionId].push(
        { sender: 'user', message, timestamp: new Date() },
        { sender: 'bot', message: reply, timestamp: new Date() }
      );
      if (inMemoryHistory[sessionId].length > 50) {
        inMemoryHistory[sessionId] = inMemoryHistory[sessionId].slice(-50);
      }
    }

    return res.status(200).json({
      success: true,
      sender: 'bot',
      message: reply,
      timestamp: new Date()
    });

  } catch (error) {
    console.error(`[ChatController] Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing message.'
    });
  }
};

/**
 * Handle GET /api/chat/history
 * Query: ?sessionId=default-session
 */
const getHistory = async (req, res) => {
  try {
    const { sessionId = 'default-session' } = req.query;
    const isDBConnected = require('mongoose').connection.readyState === 1;

    let history = [];

    if (isDBConnected) {
      history = await ChatMessage.find({ sessionId })
        .sort({ timestamp: 1 })
        .select('sender message timestamp -_id');
    } else {
      history = inMemoryHistory[sessionId] || [];
    }

    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error(`[ChatController] History Fetch Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while fetching chat history.'
    });
  }
};

module.exports = {
  sendMessage,
  getHistory
};
