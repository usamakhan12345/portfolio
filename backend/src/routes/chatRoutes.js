const express = require('express');
const router = express.Router();
const { sendMessage, getHistory } = require('../controllers/chatController');

// Route for sending a chat message -> POST /api/chat
router.post('/', sendMessage);

// Route for retrieving chat history -> GET /api/chat/history
router.get('/history', getHistory);

module.exports = router;
