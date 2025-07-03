import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Gift, Cake } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useEmployees } from '../hooks/useEmployees';

const Navigation = () => {
  const location = useLocation();
  const { employees } = useEmployees();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/employee', label: 'Employee List', icon: Users }
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-purple-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-purple-800">
            <Gift className="text-pink-600 animate-bounce" />
            Day Celebrity
            <Cake className="text-pink-600 animate-bounce" />
          </Link>

          {/* Navigation Links and Notification Center */}
          <div className="flex items-center gap-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-600 hover:bg-purple-100'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            
            {/* Notification Center */}
            <NotificationCenter employees={employees} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
