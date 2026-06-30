require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Only listen if not running in production serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
