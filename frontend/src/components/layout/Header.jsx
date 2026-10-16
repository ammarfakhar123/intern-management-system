import React from 'react';
import { Menu, Shield, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-black text-slate-900 tracking-tight">
            {title || 'Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {currentDate} • Welcome, <span className="font-bold text-slate-800">{user?.name}</span>
          </p>
        </div>
      </div>

      {/* Right: Badges & Profile */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isAdmin
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}
        >
          {isAdmin ? (
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
          ) : (
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
          )}
          <span className="capitalize">{user?.role}</span>
        </div>

        {/* User avatar indicator */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-bold text-slate-800 hidden md:inline">
            {user?.name}
          </span>
        </div>

        {/* Quick logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
