const fs = require('fs');
const Document = require('../models/Document');
const Chunk = require('../models/Chunk');
const { extractText, splitTextIntoChunks } = require('../rag/ingestion.service');
const { generateEmbedding } = require('../rag/embedding.service');
const { deleteVectorsByDocId, upsertVectors } = require('../rag/vector.service');
const localDB = require('../utils/localDB');

/**
 * Handle POST /api/rag/upload
 * Upload document file, extract text content, segment into chunks, and store.
 * Falls back to local JSON files if MongoDB is offline.
 */
const uploadDocument = async (req, res) => {
  let tempFilePath = null;
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    tempFilePath = file.path;
    const { originalname, mimetype } = file;

    console.log(`[RAGController] Uploaded raw file: ${originalname} (${mimetype})`);

    // 1. Extract text content based on file type
    const textContent = await extractText(tempFilePath, mimetype);

    if (!textContent.trim()) {
      // Clean up temp file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      return res.status(400).json({
        success: false,
        error: 'Extracted document content is empty.'
      });
    }

    // 2. Segment text into chunks
    const textChunks = splitTextIntoChunks(textContent);

    const isDBConnected = require('mongoose').connection.readyState === 1;
    let documentId;

    if (isDBConnected) {
      // Use MongoDB Atlas
      console.log('[RAGController] Database connected. Saving upload to MongoDB.');
      
      // Save Document metadata in MongoDB
      const docRecord = await Document.create({
        title: originalname.substring(0, originalname.lastIndexOf('.')) || originalname,
        originalFilename: originalname,
        mimeType: mimetype,
        filePath: tempFilePath,
        chunkCount: textChunks.length
      });

      documentId = docRecord._id;

      // Save Text Chunks in MongoDB
      console.log(`[RAGController] Saving ${textChunks.length} chunks directly to MongoDB...`);
      const chunkPromises = textChunks.map(async (content, index) => {
        const vector = await generateEmbedding(content);
        
        return Chunk.create({
          documentId: docRecord._id,
          chunkIndex: index,
          content: content,
          embedding: vector,
          metadata: {
            source: docRecord.originalFilename,
            docId: docRecord._id.toString()
          }
        });
      });
      await Promise.all(chunkPromises);
    } else {
      // Use Local JSON Files Fallback
      console.warn('[RAGController] Database offline. Falling back to local JSON file storage.');
      
      const newDocId = `doc-${Date.now()}`;
      documentId = newDocId;

      const docRecord = {
        _id: newDocId,
        id: newDocId,
        title: originalname.substring(0, originalname.lastIndexOf('.')) || originalname,
        originalFilename: originalname,
        mimeType: mimetype,
        filePath: tempFilePath,
        chunkCount: textChunks.length,
        createdAt: new Date().toISOString()
      };

      // Save metadata
      localDB.saveDocument(docRecord);

      // Save chunks
      const localChunks = textChunks.map((content, index) => ({
        documentId: newDocId,
        chunkIndex: index,
        content: content,
        embedding: [],
        metadata: {
          source: originalname,
          docId: newDocId
        }
      }));
      localDB.saveChunks(localChunks);
    }

    // Clean up temporary uploaded file from uploads folder
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      documentId: documentId,
      chunks: textChunks.length
    });

  } catch (error) {
    console.error(`[RAGController] Upload Error: ${error.message}`);
    // Cleanup file in case of error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    return res.status(500).json({
      success: false,
      error: `Failed to process document upload: ${error.message}`
    });
  }
};

/**
 * Handle GET /api/rag/documents
 * List all uploaded document records.
 * Falls back to local JSON files if MongoDB is offline.
 */
const getDocuments = async (req, res) => {
  try {
    const isDBConnected = require('mongoose').connection.readyState === 1;
    
    if (isDBConnected) {
      const documents = await Document.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        documents
      });
    } else {
      console.log('[RAGController] Database offline. Reading documents list from local JSON.');
      const documents = localDB.getDocuments().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({
        success: true,
        documents
      });
    }
  } catch (error) {
    console.error(`[RAGController] Fetch Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve document list.'
    });
  }
};

/**
 * Handle DELETE /api/rag/document/:id
 * Delete document metadata record and all associated chunks.
 * Falls back to local JSON files if MongoDB is offline.
 */
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const isDBConnected = require('mongoose').connection.readyState === 1;

    if (isDBConnected) {
      const document = await Document.findById(id);
      if (!document) {
        return res.status(404).json({ success: false, error: 'Document not found.' });
      }

      console.log(`[RAGController] Deleting MongoDB document: ${document.originalFilename} (${id})`);

      // 1. Delete associated chunks from MongoDB
      await Chunk.deleteMany({ documentId: id });

      // 2. Delete index vectors from vector database
      await deleteVectorsByDocId(id);

      // 3. Delete metadata record from Document collection
      await Document.findByIdAndDelete(id);
    } else {
      console.log(`[RAGController] Database offline. Deleting local JSON document and chunks for: ${id}`);
      localDB.deleteDocument(id);
    }

    return res.status(200).json({
      success: true,
      message: 'Document and associated chunks deleted successfully.'
    });

  } catch (error) {
    console.error(`[RAGController] Delete Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete document.'
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument
};
