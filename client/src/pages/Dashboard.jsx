import React, { useState, useEffect } from 'react';
import UploadBox from '../components/Upload/UploadBox';
import DocumentTable from '../components/Documents/DocumentTable';
import Toast from '../components/Notifications/Toast';
import NotificationCenter from '../components/Notifications/NotificationCenter';
import Header from '../components/Layout/Header';
import socketService from '../services/socket';

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Connect to Socket.IO
    socketService.connect('user_' + Math.random().toString(36).substr(2, 9));

    // Listen for upload completion events
    socketService.onUploadComplete((data) => {
      console.log('Upload complete:', data);
      showToast(data.message || 'Upload completed successfully', 'success');
      setRefreshTrigger(prev => prev + 1);
    });

    // Listen for bulk upload start
    socketService.onBulkUploadUpdate((data) => {
      console.log('Bulk upload update:', data);
      showToast(data.message || 'Bulk upload started', 'info');
    });

    // Listen for new notifications
    socketService.onNotification((notification) => {
      console.log('New notification:', notification);
      showToast(notification.message, notification.type);
    });

    // Listen for unread count updates
    socketService.onUnreadCountUpdate((data) => {
      console.log('Unread count updated:', data);
      // Update notification badge if needed
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Livvic, sans-serif' }}>
            Document Management Dashboard
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Livvic, sans-serif' }}>
            Upload, manage, and track your PDF documents
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UploadBox 
              onUpload={handleUploadComplete} 
              showToast={showToast} 
              key={refreshTrigger}
            />
            <DocumentTable 
              onRefresh={handleUploadComplete}
              key={`docs-${refreshTrigger}`}
            />
          </div>

          <div className="lg:col-span-1">
            <NotificationCenter />
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Dashboard;
