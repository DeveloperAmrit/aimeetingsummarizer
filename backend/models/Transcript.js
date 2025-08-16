const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Transcript', transcriptSchema);
