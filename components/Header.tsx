import React from 'react';
import type { User } from '../types';
import AdminIcon from './icons/AdminIcon';
import LogoutIcon from './icons/LogoutIcon';
import CrownIcon from './icons/CrownIcon';
import PukatuLogo from './PukatuLogo';
import BackendStatus from './BackendStatus';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onAdminClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onAdminClick, onHomeClick }) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onHomeClick}
          >
            <PukatuLogo className="w-10 h-10" />
            <span className="text-2xl font-poppins font-bold text-white">
              Pukatu
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <BackendStatus />
            {user && (user.role === 'superadmin' || user.role === 'admin') && (
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <AdminIcon className="w-5 h-5" />
                <span>Admin</span>
              </button>
            )}
            {user ? (
                <div className="flex items-center space-x-2">
                    {user.username === 'Roble' && <CrownIcon className="w-5 h-5 text-yellow-400" />}
                    <span className="text-sm font-medium text-white hidden sm:inline">{user.username}</span>
                    <button
                        onClick={onLogoutClick}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        aria-label="Logout"
                    >
                        <LogoutIcon className="w-5 h-5" />
                    </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-md text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;