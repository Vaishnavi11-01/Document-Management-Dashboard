const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true,
    default: 'application/pdf'
  },
  uploadPath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'uploading', 'completed', 'failed'],
    default: 'completed'
  },
  uploadProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  uploadedBy: {
    type: String,
    default: 'anonymous'
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
fileSchema.index({ originalName: 1 });
fileSchema.index({ createdAt: -1 });
fileSchema.index({ status: 1 });

module.exports = mongoose.model('File', fileSchema);
