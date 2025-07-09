
import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: string, pass: string) => void;
  error?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-poppins font-bold">Acceso Admin</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Clave</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="pt-2 flex justify-end">
            <button type="submit" className="w-full px-4 py-2 rounded-md text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
