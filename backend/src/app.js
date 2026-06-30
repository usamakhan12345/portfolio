const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Adjust to specific frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Main base entry route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Portfolio RAG Backend API',
    status: 'Running',
    endpoints: {
      chat: 'POST /api/chat',
      chatHistory: 'GET /api/chat/history',
      ragUpload: 'POST /api/rag/upload',
      ragList: 'GET /api/rag/documents',
      ragDelete: 'DELETE /api/rag/document/:id'
    }
  });
});

// Register routes
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/rag', require('./routes/ragRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[App Error] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Something went wrong on the server.'
  });
});

// Database connection initializer hook
const initializeApp = async () => {
  await connectDB();
};

initializeApp();

module.exports = app;
