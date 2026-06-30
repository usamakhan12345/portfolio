const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    chunkIndex: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number],
      default: []
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying in order
ChunkSchema.index({ documentId: 1, chunkIndex: 1 });

module.exports = mongoose.model('Chunk', ChunkSchema);
