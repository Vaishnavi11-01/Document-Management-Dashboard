import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotificationsPage from './pages/NotificationsPage';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </div>
  );
}

export default App;
