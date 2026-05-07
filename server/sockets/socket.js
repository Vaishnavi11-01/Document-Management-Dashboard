const Notification = require('../models/Notification');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join user to their personal room (for future multi-user support)
    const userId = socket.handshake.query.userId || 'anonymous';
    socket.join(userId);

    // Send unread notifications count on connection
    socket.emit('unread-count', async () => {
      try {
        const unreadCount = await Notification.countDocuments({ isRead: false });
        return unreadCount;
      } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }
    });

    // Handle file upload progress
    socket.on('upload-start', (data) => {
      console.log('Upload started:', data);
      socket.broadcast.emit('upload-progress', {
        status: 'started',
        filename: data.filename,
        progress: 0
      });
    });

    // Handle real-time notifications
    socket.on('mark-notification-read', async (notificationId) => {
      try {
        const notification = await Notification.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );

        if (notification) {
          // Update unread count for all clients
          const unreadCount = await Notification.countDocuments({ isRead: false });
          io.emit('unread-count-updated', { unreadCount });
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    // Handle bulk upload status
    socket.on('bulk-upload-status', (data) => {
      socket.broadcast.emit('bulk-upload-update', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Function to emit notifications to all clients
  const emitNotification = async (notification) => {
    try {
      // Emit to all connected clients
      io.emit('new-notification', notification);
      
      // Update unread count
      const unreadCount = await Notification.countDocuments({ isRead: false });
      io.emit('unread-count-updated', { unreadCount });
    } catch (error) {
      console.error('Error emitting notification:', error);
    }
  };

  // Function to emit upload progress
  const emitUploadProgress = (data) => {
    io.emit('upload-progress', data);
  };

  // Make functions available globally
  global.emitNotification = emitNotification;
  global.emitUploadProgress = emitUploadProgress;
};

module.exports = socketHandler;
