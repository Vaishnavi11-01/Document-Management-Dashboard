import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// File upload API calls
export const uploadAPI = {
  // Single file upload
  uploadSingle: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // Multiple files upload
  uploadMultiple: async (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // Get upload progress
  getProgress: (fileId) => api.get(`/upload/progress/${fileId}`),
};

// File management API calls
export const fileAPI = {
  // Get all files with pagination
  getFiles: (params = {}) => {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    return api.get('/files', {
      params: { page, limit, search, sortBy, sortOrder }
    });
  },

  // Get single file by ID
  getFile: (id) => api.get(`/files/${id}`),

  // Download file
  downloadFile: (filename) => {
    const url = `${api.defaults.baseURL}/files/download/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Delete file
  deleteFile: (id) => api.delete(`/files/${id}`),

  // Get file statistics
  getStats: () => api.get('/files/stats/summary'),
};

// Notification API calls
export const notificationAPI = {
  // Get all notifications
  getNotifications: (params = {}) => {
    const { page = 1, limit = 20, type, isRead } = params;
    return api.get('/notifications', {
      params: { page, limit, type, isRead }
    });
  },

  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),

  // Mark notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () => api.put('/notifications/read-all'),

  // Delete notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  // Clear all notifications
  clearAll: () => api.delete('/notifications'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
