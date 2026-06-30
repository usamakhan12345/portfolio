const Chunk = require('../models/Chunk');

// Common English stopwords to ignore in search tokens
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is',
  'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
  'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
  'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
  'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
  'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Calculates the cosine similarity between two vectors.
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} Similarity score between 0 and 1
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Tokenize a text string into alphanumeric lowercase terms, ignoring stopwords.
 */
const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token && !STOPWORDS.has(token));
};

const upsertVectors = async (records) => {
  return true;
};

const deleteVectorsByDocId = async (documentId) => {
  return true;
};

/**
 * Search similarity against MongoDB chunk vectors.
 * Supports Cosine Vector Similarity if embeddings are loaded, and falls back to Local Token Overlap otherwise.
 * @param {Array<number>} queryVector - Query embedding vector
 * @param {number} topK - Number of matching matches to return
 * @param {string} queryText - User text query
 * @returns {Promise<Array<object>>} Top matching chunks
 */
const querySimilarity = async (queryVector, topK = 3, queryText = '') => {
  try {
    const isDBConnected = require('mongoose').connection.readyState === 1;
    let chunks = [];

    // 1. Fetch chunks
    if (isDBConnected) {
      chunks = await Chunk.find();
    } else {
      console.log('[VectorService] Database offline. Reading search chunks from local JSON fallback...');
      const localDB = require('../utils/localDB');
      chunks = localDB.getChunks();
    }

    if (!chunks || chunks.length === 0) {
      return [];
    }

    // 2. Check if we have valid vector dimensions for Cosine Similarity search
    const hasVectorData = queryVector && queryVector.length > 0 && chunks.some(c => c.embedding && c.embedding.length > 0);

    if (hasVectorData) {
      console.log(`[VectorService] Performing Cosine Vector search over ${chunks.length} chunks`);
      const scoredChunks = chunks.map(chunk => {
        const chunkEmbedding = chunk.embedding || [];
        const score = cosineSimilarity(queryVector, chunkEmbedding);
        
        return {
          content: chunk.content,
          score,
          metadata: {
            source: (chunk.metadata && typeof chunk.metadata.get === 'function') ? chunk.metadata.get('source') : (chunk.metadata?.source || 'Uploaded Document')
          }
        };
      });

      scoredChunks.sort((a, b) => b.score - a.score);
      const matches = scoredChunks.filter(c => c.score > 0).slice(0, topK);
      
      if (matches.length > 0) {
        console.log(`[VectorService] Top vector similarity score: ${matches[0].score.toFixed(4)}`);
      }
      return matches;
    }

    // 3. Fallback: Perform local keyword/token similarity search
    if (!queryText) {
      return [];
    }

    const queryTokens = tokenize(queryText);
    if (queryTokens.length === 0) {
      return [];
    }

    console.log(`[VectorService] Performing token-overlap search over ${chunks.length} chunks for: ${queryTokens.join(', ')}`);

    const scoredChunks = chunks.map(chunk => {
      const content = chunk.content;
      const contentLower = content.toLowerCase();
      const contentTokens = tokenize(content);
      const tokenSet = new Set(contentTokens);
      
      let score = 0;

      queryTokens.forEach(token => {
        if (tokenSet.has(token)) {
          score += 1.0;
          const regex = new RegExp(`\\b${token}\\b`, 'g');
          const occurrences = (contentLower.match(regex) || []).length;
          score += occurrences * 0.1;
        }
      });

      if (queryTokens.length > 1) {
        for (let i = 0; i < queryTokens.length - 1; i++) {
          const phrase = `${queryTokens[i]} ${queryTokens[i+1]}`;
          if (contentLower.includes(phrase)) {
            score += 1.5;
          }
        }
      }

      // Exact query inclusion boost
      const cleanQueryText = queryText.replace(/[^a-z0-9\s]/gi, '').trim().toLowerCase();
      if (cleanQueryText) {
        const escapedQuery = cleanQueryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const queryRegex = new RegExp(`\\b${escapedQuery}\\b`);
        if (queryRegex.test(contentLower)) {
          score += 3.0;
        }
      }

      const lengthPenalty = Math.log(content.length);
      const normalizedScore = lengthPenalty > 0 ? score / lengthPenalty : 0;

      return {
        content,
        score: normalizedScore,
        metadata: {
          source: (chunk.metadata && typeof chunk.metadata.get === 'function') ? chunk.metadata.get('source') : (chunk.metadata?.source || 'Uploaded Document')
        }
      };
    });

    const matchingChunks = scoredChunks.filter(c => c.score > 0);
    matchingChunks.sort((a, b) => b.score - a.score);

    console.log(`[VectorService] Offline search matches found: ${matchingChunks.length}`);
    return matchingChunks.slice(0, topK);

  } catch (error) {
    console.error(`[VectorService] Similarity Search Error: ${error.message}`);
    return [];
  }
};

module.exports = {
  upsertVectors,
  deleteVectorsByDocId,
  querySimilarity
};
