
import React, { useState } from 'react';
import type { User } from '../types';
import CrownIcon from './icons/CrownIcon';

interface UserManagementViewProps {
    currentUser: User;
    users: User[];
    onCreateUser: (newUser: User) => void;
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
    const tests = [
        /.{8,}/,      // min 8 chars
        /[A-Z]/,      // one uppercase letter
        /[a-z]/,      // one lowercase letter
        /[0-9]/,      // one digit
        /[!@#$%^&*]/ // one special character
    ];
    const strength = tests.reduce((acc, test) => acc + (test.test(password) ? 1 : 0), 0);
    const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    const strengthText = ['Muy Débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Muy Fuerte'];

    return (
        <div className="flex items-center gap-2 mt-1">
            <div className="w-full bg-gray-600 rounded-full h-2">
                <div className={`h-2 rounded-full ${strengthColors[strength]}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
            </div>
            <span className="text-xs text-slate-300 w-24 text-right">{strengthText[strength]}</span>
        </div>
    );
};

const UserManagementView: React.FC<UserManagementViewProps> = ({ currentUser, users, onCreateUser }) => {
    const [form, setForm] = useState({ username: '', password: '', phone: '', role: 'user' as User['role'] });
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.username || !form.password || !form.phone) {
            setError('Todos los campos son requeridos.');
            return;
        }
        // Basic password strength check before submission
        if (form.password.length < 8) {
             setError('La contraseña debe tener al menos 8 caracteres.');
             return;
        }
        
        onCreateUser(form as User);
        setForm({ username: '', password: '', phone: '', role: 'user' }); // Reset form
    };

    return (
        <div className="space-y-8">
            <div className="super-admin-bg p-6 rounded-lg">
                <h2 className="text-2xl font-poppins font-bold mb-4 super-admin-text flex items-center gap-2"><CrownIcon /> Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     {error && <p className="text-red-300 bg-red-900/50 p-2 rounded-md text-sm">{error}</p>}
                    <input type="text" placeholder="Nombre de usuario" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required className="w-full p-2 rounded super-admin-input" />
                    <div>
                        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full p-2 rounded super-admin-input" />
                        <PasswordStrengthIndicator password={form.password} />
                    </div>
                    <input type="tel" placeholder="Teléfono de contacto" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="w-full p-2 rounded super-admin-input" />
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} className="w-full p-2 rounded super-admin-input">
                        <option value="user">Usuario</option>
                        <option value="admin">Admin</option>
                        {currentUser.username === 'Roble' && <option value="superadmin">Super Admin</option>}
                    </select>
                    <div className="flex justify-end">
                        <button type="submit" className="px-6 py-2 rounded super-admin-button hover:bg-yellow-300 transition-colors">Crear Usuario</button>
                    </div>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-poppins font-bold mb-4">Usuarios Existentes</h2>
                <div className="space-y-3">
                    {users.map(user => (
                        <div key={user.username} className="glassmorphism p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white flex items-center gap-2">
                                    {user.role === 'superadmin' && <CrownIcon className="text-yellow-400 w-5 h-5"/>}
                                    {user.username}
                                </p>
                                <p className="text-sm text-slate-400">{user.phone}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'superadmin' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'}`}>
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagementView;
