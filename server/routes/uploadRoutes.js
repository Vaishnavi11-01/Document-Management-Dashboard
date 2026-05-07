const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadSingle, uploadMultiple, trackProgress } = require('../middleware/uploadMiddleware');

// Single file upload
router.post('/single', uploadSingle, uploadController.uploadSingle);

// Multiple files upload
router.post('/multiple', uploadMultiple, uploadController.uploadMultiple);

// Get upload progress
router.get('/progress/:fileId', uploadController.getUploadProgress);

module.exports = router;
