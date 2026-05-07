import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  // Connect to Socket.IO server
  connect(userId = 'anonymous') {
    if (this.socket && this.connected) {
      return this.socket;
    }

    const serverUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';
    
    this.socket = io(serverUrl, {
      query: { userId },
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.connected = false;
    });

    return this.socket;
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Check if connected
  isConnected() {
    return this.connected;
  }

  // Event listeners for notifications
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('new-notification', callback);
    }
  }

  // Event listeners for upload progress
  onUploadProgress(callback) {
    if (this.socket) {
      this.socket.on('upload-progress', callback);
    }
  }

  // Event listeners for unread count updates
  onUnreadCountUpdate(callback) {
    if (this.socket) {
      this.socket.on('unread-count-updated', callback);
    }
  }

  // Event listeners for bulk upload updates
  onBulkUploadUpdate(callback) {
    if (this.socket) {
      this.socket.on('bulk-upload-start', callback);
      this.socket.on('bulk-upload-complete', callback);
    }
  }

  // Event listeners for upload completion
  onUploadComplete(callback) {
    if (this.socket) {
      this.socket.on('upload-complete', callback);
      this.socket.on('all-uploads-complete', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }

  // Start upload tracking
  startUpload(filename) {
    this.emit('upload-start', { filename });
  }

  // Mark notification as read
  markNotificationRead(notificationId) {
    this.emit('mark-notification-read', notificationId);
  }

  // Send bulk upload status
  sendBulkUploadStatus(data) {
    this.emit('bulk-upload-status', data);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
