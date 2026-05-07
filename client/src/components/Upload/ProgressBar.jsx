import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';

const ProgressBar = ({ 
  progress = 0, 
  status = 'pending', 
  loaded, 
  total, 
  startTime,
  error,
  className = '' 
}) => {
  const getProgressColor = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'uploading':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getElapsedTime = () => {
    if (!startTime) return null;
    return Math.round((Date.now() - startTime) / 1000);
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending...';
      case 'uploading':
        return (
          <span className="flex items-center space-x-2">
            <span>Uploading... {Math.round(progress)}%</span>
            {loaded && total && (
              <span className="text-gray-500">
                ({formatFileSize(loaded)} / {formatFileSize(total)})
              </span>
            )}
          </span>
        );
      case 'complete':
        return 'Complete';
      case 'error':
        return error || 'Failed';
      default:
        return 'Preparing...';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ease-out ${getProgressColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Status Information */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-xs text-gray-600">
            {getStatusText()}
          </span>
        </div>
        
        {/* Additional Info */}
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          {status === 'uploading' && startTime && (
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{getElapsedTime()}s</span>
            </span>
          )}
          
          {status === 'uploading' && loaded && total && (
            <span>
              {Math.round((loaded / total) * 100)}%
            </span>
          )}
          
          {status === 'complete' && (
            <span className="text-green-600 font-medium">
              ✓ Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
