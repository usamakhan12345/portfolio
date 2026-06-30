const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    originalFilename: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    chunkCount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
