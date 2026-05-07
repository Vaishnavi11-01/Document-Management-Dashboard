const express = require('express');
const router = express.Router();
const File = require('../models/File');
const path = require('path');
const fs = require('fs');

// Get all files
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const files = await File.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await File.countDocuments(query);

    res.json({
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single file by ID
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download file
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Find file record to get original name
    const fileRecord = await File.findOne({ filename });
    if (!fileRecord) {
      return res.status(404).json({ error: 'File record not found' });
    }

    res.download(filePath, fileRecord.originalName);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.uploadPath)) {
      fs.unlinkSync(file.uploadPath);
    }

    // Delete file record
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get file statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalFiles = await File.countDocuments();
    const totalSize = await File.aggregate([
      { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
    ]);
    
    const recentFiles = await File.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalFiles,
      totalSize: totalSize[0]?.totalSize || 0,
      recentFiles
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
