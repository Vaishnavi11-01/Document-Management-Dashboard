import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Livvic, sans-serif' }}>
                Upload Documents
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">Upload component will be implemented here</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Livvic, sans-serif' }}>
                Document Library
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-500">Document table component will be implemented here</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Livvic, sans-serif' }}>
                Notifications
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-500">Notification component will be implemented here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
