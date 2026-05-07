import React from 'react';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import logo from '../../assets/logo.svg';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="DocHub Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Livvic, sans-serif' }}>
                DocHub
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
