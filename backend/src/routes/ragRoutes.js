const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/ragController');

// Ensure upload directory exists inside workspace
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name to prevent collision
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer file filter to accept PDF, DOCX, TXT, and Markdown
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file extension: ${ext}. Supported: PDF, DOCX, TXT, MD`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload Document -> POST /api/rag/upload
router.post('/upload', upload.any(), uploadDocument);

// Get Documents List -> GET /api/rag/documents
router.get('/documents', getDocuments);

// Delete Document -> DELETE /api/rag/document/:id
router.delete('/document/:id', deleteDocument);

module.exports = router;
