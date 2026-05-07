const File = require('../models/File');
const Notification = require('../models/Notification');

const uploadController = {
  // Handle single file upload
  uploadSingle: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadPath: req.file.path,
        status: 'completed',
        uploadProgress: 100
      };

      const newFile = new File(fileData);
      await newFile.save();

      // Create success notification
      await Notification.create({
        message: `File "${req.file.originalname}" uploaded successfully`,
        type: 'success',
        metadata: { fileId: newFile._id }
      });

      res.status(201).json({
        message: 'File uploaded successfully',
        file: newFile
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Create error notification
      await Notification.create({
        message: `File upload failed: ${error.message}`,
        type: 'error'
      });

      res.status(500).json({ error: error.message });
    }
  },

  // Handle multiple file upload
  uploadMultiple: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const uploadedFiles = [];
      const totalFiles = req.files.length;
      const isBulkUpload = totalFiles > 3;

      // Create bulk upload notification
      if (isBulkUpload) {
        await Notification.create({
          message: `Bulk upload in progress — processing ${totalFiles} files in background.`,
          type: 'info',
          metadata: { totalFiles, isBulkUpload: true }
        });
      }

      // Process each file
      for (const file of req.files) {
        const fileData = {
          filename: file.filename,
          originalName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadPath: file.path,
          status: 'completed',
          uploadProgress: 100
        };

        const newFile = new File(fileData);
        await newFile.save();
        uploadedFiles.push(newFile);
      }

      // Create completion notification for bulk uploads
      if (isBulkUpload) {
        setTimeout(async () => {
          await Notification.create({
            message: `${totalFiles} files uploaded successfully`,
            type: 'success',
            metadata: { totalFiles, isBulkUpload: true }
          });
        }, 2000); // Simulate processing time
      }

      res.status(201).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
        totalFiles,
        isBulkUpload
      });

    } catch (error) {
      console.error('Bulk upload error:', error);
      
      await Notification.create({
        message: `Bulk upload failed: ${error.message}`,
        type: 'error'
      });

      res.status(500).json({ error: error.message });
    }
  },

  // Get upload progress
  getUploadProgress: async (req, res) => {
    try {
      const { fileId } = req.params;
      
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.json({
        fileId: file._id,
        progress: file.uploadProgress,
        status: file.status,
        filename: file.originalName
      });

    } catch (error) {
      console.error('Progress error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = uploadController;
