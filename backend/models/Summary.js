const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  transcriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transcript',
    required: true
  },
  originalContent: {
    type: String,
    required: true
  },
  customPrompt: {
    type: String,
    default: ''
  },
  generatedSummary: {
    type: String,
    required: true
  },
  editedSummary: {
    type: String,
    default: ''
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'groq'],
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

summarySchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

module.exports = mongoose.model('Summary', summarySchema);
