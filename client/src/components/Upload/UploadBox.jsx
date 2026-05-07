import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const UploadBox = ({ onUpload, showToast }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      showToast('Only PDF files are allowed', 'error');
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending',
      error: null
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);
    handleUpload(newFiles);
  }, [showToast]);

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const handleUpload = async (filesToUpload) => {
    const isBulkUpload = filesToUpload.length > 3;
    
    if (isBulkUpload) {
      showToast(`Bulk upload in progress — processing ${filesToUpload.length} files in background.`, 'info');
    }

    try {
      const { uploadAPI } = await import('../services/api');
      
      for (const fileObj of filesToUpload) {
        try {
          // Update status to uploading
          setUploadingFiles(prev => 
            prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f)
          );

          // Simulate progress
          simulateProgress(fileObj.id);

          // Upload file
          const response = await uploadAPI.uploadSingle(fileObj.file, (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadingFiles(prev => 
              prev.map(f => f.id === fileObj.id ? { ...f, progress } : f)
            );
          });

          // Mark as complete
          setUploadingFiles(prev => 
            prev.map(f => f.id === fileObj.id ? { ...f, status: 'complete', progress: 100 } : f)
          );

          if (onUpload) {
            onUpload(response.data.file);
          }

        } catch (error) {
          console.error('Upload error:', error);
          setUploadingFiles(prev => 
            prev.map(f => f.id === fileObj.id ? { 
              ...f, 
              status: 'error', 
              error: error.response?.data?.error || error.message 
            } : f)
          );
        }
      }

      // Show success message for individual uploads
      if (!isBulkUpload) {
        showToast(`${filesToUpload.length} file(s) uploaded successfully`, 'success');
      }

      // Clean up completed files after delay
      setTimeout(() => {
        setUploadingFiles(prev => 
          prev.filter(f => !filesToUpload.find(file => file.id === f.id))
        );
      }, 3000);

    } catch (error) {
      console.error('Bulk upload error:', error);
      showToast('Upload failed. Please try again.', 'error');
    }
  };

  const simulateProgress = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadingFiles(prev =>
        prev.map(f => f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f)
      );
    }, 200);
  };

  const removeFile = (fileId) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'Livvic, sans-serif' }}>
        Upload Documents
      </h2>
      
      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          dropzoneActive || isDragActive
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
        {dropzoneActive || isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-700 font-medium mb-2">Drag & drop PDF files here, or click to select</p>
            <p className="text-sm text-gray-500">Maximum file size: 10MB. PDF files only.</p>
          </div>
        )}
      </div>

      {/* Upload Progress List */}
      {uploadingFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-gray-700">Upload Progress</h3>
          {uploadingFiles.map((fileObj) => (
            <div key={fileObj.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(fileObj.status)}
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {fileObj.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(fileObj.file.size)}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    fileObj.status === 'complete' 
                      ? 'bg-green-500' 
                      : fileObj.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${fileObj.progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600">
                  {fileObj.status === 'pending' && 'Pending...'}
                  {fileObj.status === 'uploading' && `Uploading... ${Math.round(fileObj.progress)}%`}
                  {fileObj.status === 'complete' && 'Complete'}
                  {fileObj.status === 'error' && fileObj.error || 'Failed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadBox;
