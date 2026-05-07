const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 50 // Maximum 50 files at once
  },
  fileFilter: fileFilter
});

// Single file upload middleware
const uploadSingle = upload.single('file');

// Multiple files upload middleware
const uploadMultiple = upload.array('files', 50);

// Progress tracking middleware
const trackProgress = (req, res, next) => {
  const originalSend = res.send;
  
  // Simulate progress for uploads
  if (req.files && req.files.length > 0) {
    const progressInterval = setInterval(() => {
      // Emit progress via socket if available
      if (req.io) {
        req.io.emit('upload-progress', {
          progress: Math.min(100, (Date.now() - req.uploadStartTime) / 10),
          filename: req.files[0]?.originalname || 'upload'
        });
      }
    }, 200);

    res.on('finish', () => {
      clearInterval(progressInterval);
    });
  }
  
  res.send = originalSend;
  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  trackProgress
};
