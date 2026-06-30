/**
 * Context Retrieval Pipeline Service
 * Generates query embeddings, searches vector indexes, and formats the retrieved text context.
 */
const { generateEmbedding } = require('./embedding.service');
const { querySimilarity } = require('./vector.service');
const Chunk = require('../models/Chunk');

/**
 * Retrieve matching context blocks from the vector store or MongoDB fallback.
 * @param {string} userQuery - The input prompt text
 * @param {number} limit - Maximum number of chunks to fetch
 * @returns {Promise<string>} Combined string of matching context blocks
 */
const retrieveContext = async (userQuery, limit = 3) => {
  try {
    console.log(`[RetrievalService] Processing retrieval for: "${userQuery}"`);

    // 1. Generate Query Vector Embedding
    const queryVector = await generateEmbedding(userQuery);

    // 2. Perform Similarity Search in Vector database (local token overlap matcher)
    const matches = await querySimilarity(queryVector, limit, userQuery);

    // 3. Fallback: If no matches returned from vector database, check if MongoDB has any document chunks!
    if (!matches || matches.length === 0) {
      console.log('[RetrievalService] No vector matches. Checking MongoDB document chunks...');
      const isDBConnected = require('mongoose').connection.readyState === 1;
      
      if (isDBConnected) {
        // Fallback to text search on Content or retrieve random chunks
        const dbChunks = await Chunk.find()
          .limit(limit)
          .select('content metadata');
        
        if (dbChunks && dbChunks.length > 0) {
          return dbChunks
            .map(chunk => `[Source: ${chunk.metadata?.get('source') || 'Database'}] ${chunk.content}`)
            .join('\n\n');
        }
      }
      return '';
    }

    // 4. Format and join context blocks
    return matches
      .map(match => `[Source: ${match.metadata?.source || 'Document'}] ${match.text || match.content}`)
      .join('\n\n');

  } catch (error) {
    console.error(`[RetrievalService] Error retrieving context: ${error.message}`);
    return ''; // Fail-safe: Return empty context
  }
};

module.exports = {
  retrieveContext
};
