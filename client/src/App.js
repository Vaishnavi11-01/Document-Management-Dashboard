import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
