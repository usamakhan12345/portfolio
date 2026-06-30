const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const docsFile = path.join(dataDir, 'documents.json');
const chunksFile = path.join(dataDir, 'chunks.json');

const readJSON = (file) => {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
  getDocuments: () => readJSON(docsFile),
  
  saveDocument: (doc) => {
    const docs = readJSON(docsFile);
    docs.push(doc);
    writeJSON(docsFile, docs);
    return doc;
  },
  
  deleteDocument: (docId) => {
    const docs = readJSON(docsFile);
    const filteredDocs = docs.filter(d => d._id !== docId && d.id !== docId);
    writeJSON(docsFile, filteredDocs);

    const chunks = readJSON(chunksFile);
    const filteredChunks = chunks.filter(c => c.documentId !== docId);
    writeJSON(chunksFile, filteredChunks);
  },
  
  getChunks: () => readJSON(chunksFile),
  
  saveChunks: (newChunks) => {
    const chunks = readJSON(chunksFile);
    chunks.push(...newChunks);
    writeJSON(chunksFile, chunks);
  }
};
