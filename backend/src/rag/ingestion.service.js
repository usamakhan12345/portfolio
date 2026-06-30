const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract raw text content from file buffer based on MIME type.
 * @param {string} filePath - Path of the uploaded file on disk
 * @param {string} mimeType - File MIME type (e.g. application/pdf)
 * @returns {Promise<string>} Extracted text content
 */
const extractText = async (filePath, mimeType) => {
  const fileBuffer = fs.readFileSync(filePath);

  console.log(`[IngestionService] Extracting text from file: ${filePath} (${mimeType})`);

  if (mimeType === 'application/pdf') {
    const data = await pdfParse(fileBuffer);
    return data.text || '';
  } 
  
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    mimeType === 'application/msword'
  ) {
    const data = await mammoth.extractRawText({ buffer: fileBuffer });
    return data.value || '';
  }

  if (
    mimeType === 'text/plain' || 
    mimeType === 'text/markdown' || 
    mimeType === 'text/x-markdown' ||
    filePath.endsWith('.txt') ||
    filePath.endsWith('.md')
  ) {
    return fileBuffer.toString('utf-8');
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
};

/**
 * Split text into chunks with sliding overlap window.
 * @param {string} text - Raw text to split
 * @param {number} chunkSize - Number of characters per chunk
 * @param {number} chunkOverlap - Overlap size
 * @returns {Array<string>} List of text chunks
 */
const splitTextIntoChunks = (text, chunkSize = 800, chunkOverlap = 100) => {
  if (!text) return [];
  
  const chunks = [];
  let start = 0;
  
  // Clean whitespace/newlines a bit to improve context formatting
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  while (start < cleanText.length) {
    const end = start + chunkSize;
    const chunk = cleanText.substring(start, end);
    chunks.push(chunk);
    
    // Slide the window forward by chunk size minus overlap
    start += (chunkSize - chunkOverlap);
    
    // Prevent infinite loop if settings are invalid
    if (chunkSize <= chunkOverlap) {
      break;
    }
  }

  console.log(`[IngestionService] Split text into ${chunks.length} chunks`);
  return chunks;
};

module.exports = {
  extractText,
  splitTextIntoChunks
};
