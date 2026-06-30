const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get Gemini API Key
const getApiKey = () => {
  return process.env.GEMINI_API_KEY || '';
};

/**
 * Generate vector embedding for a given text block using Google Gemini text-embedding-004.
 * Falls back to empty array if GEMINI_API_KEY is not defined.
 * @param {string} text - Content to embed
 * @returns {Promise<Array<number>>} 768-dimensional vector values
 */
const generateEmbedding = async (text) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    // Return empty array for local token-overlap fallback
    return [];
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    
    if (result && result.embedding && result.embedding.values) {
      return result.embedding.values;
    }
    throw new Error('Invalid response structure from Gemini Embedding API');
  } catch (error) {
    console.error(`❌ Gemini Embedding Error: ${error.message}`);
    return [];
  }
};

/**
 * Batch generate vector embeddings for multiple chunks.
 * @param {Array<string>} texts - List of text blocks
 * @returns {Promise<Array<Array<number>>>} List of vector arrays
 */
const generateEmbeddingsBatch = async (texts) => {
  console.log(`[EmbeddingService] Batch generating ${texts.length} embeddings using Gemini`);
  return Promise.all(texts.map(text => generateEmbedding(text)));
};

module.exports = {
  generateEmbedding,
  generateEmbeddingsBatch
};
