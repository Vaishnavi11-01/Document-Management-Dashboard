import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Livvic, sans-serif' }}>
            Notifications
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Livvic, sans-serif' }}>
            View and manage your notifications
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Livvic, sans-serif' }}>
              All Notifications
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-500">Notification list component will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
