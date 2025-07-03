import React, { useState } from 'react';
import type { AdminAccount } from '../types';

interface AdminLoginSectionProps {
  adminAccounts: AdminAccount[];
  onLoginSuccess: (admin: AdminAccount) => void;
}

type RecoveryStep = 'idle' | 'promptUsername' | 'promptAnswer' | 'showPassword';

const AdminLoginSection: React.FC<AdminLoginSectionProps> = ({ adminAccounts, onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('idle');
  const [recoveryUsername, setRecoveryUsername] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [selectedAdminForRecovery, setSelectedAdminForRecovery] = useState<AdminAccount | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const foundAdmin = adminAccounts.find(
      (admin) => admin.username.toLowerCase() === usernameInput.toLowerCase() && admin.password === passwordInput
    );

    if (foundAdmin) {
      onLoginSuccess(foundAdmin);
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const handleRecoveryUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage('');
    const admin = adminAccounts.find(a => a.username.toLowerCase() === recoveryUsername.toLowerCase());
    if (admin) {
      setSelectedAdminForRecovery(admin);
      setRecoveryStep('promptAnswer');
    } else {
      setRecoveryMessage('Nombre de usuario no encontrado.');
    }
  };

  const handleRecoveryAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage('');
    if (selectedAdminForRecovery && selectedAdminForRecovery.securityAnswer && recoveryAnswer.toLowerCase() === selectedAdminForRecovery.securityAnswer.toLowerCase()) {
      setRecoveryStep('showPassword');
    } else {
      setRecoveryMessage('Respuesta incorrecta o pregunta de seguridad no configurada.');
    }
  };

  const resetRecovery = () => {
    setRecoveryStep('idle');
    setRecoveryUsername('');
    setRecoveryAnswer('');
    setSelectedAdminForRecovery(null);
    setRecoveryMessage('');
    setError('');
  };

  const inputClasses = "w-full px-4 py-3 bg-[#1a1a1a] text-white border-b-2 border-[#f7ca18] focus:outline-none focus:border-yellow-300 rounded-t-md placeholder-gray-500";

  if (recoveryStep !== 'idle') {
    return (
      <section id="adminRecoverySection" className="admin-panel mt-12 mb-12 py-10">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-['Orbitron'] text-white">Recuperación de Contraseña</h3>
        </div>
        <div className="bg-[#2a1d5e] p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto">
          {recoveryStep === 'promptUsername' && (
            <form onSubmit={handleRecoveryUsernameSubmit}>
              <p className="text-gray-300 mb-4">Ingresa tu nombre de usuario para recuperar tu contraseña.</p>
              <div className="mb-6">
                <input
                  type="text"
                  value={recoveryUsername}
                  onChange={(e) => setRecoveryUsername(e.target.value)}
                  className={inputClasses}
                  placeholder="Nombre de Usuario"
                  required
                />
              </div>
              {recoveryMessage && <p className="text-red-400 text-sm mb-4 text-center">{recoveryMessage}</p>}
              <button type="submit" className="w-full bg-[#f7ca18] text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-400">Continuar</button>
              <button type="button" onClick={resetRecovery} className="w-full mt-3 text-sm text-gray-400 hover:text-white">Cancelar</button>
            </form>
          )}
          {recoveryStep === 'promptAnswer' && selectedAdminForRecovery && (
            <form onSubmit={handleRecoveryAnswerSubmit}>
              <p className="text-gray-300 mb-2">Pregunta de seguridad para <span className="font-bold text-yellow-400">{selectedAdminForRecovery.username}</span>:</p>
              {selectedAdminForRecovery.securityQuestion ? (
                <>
                  <p className="text-lg text-white mb-4 italic">"{selectedAdminForRecovery.securityQuestion}"</p>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={recoveryAnswer}
                      onChange={(e) => setRecoveryAnswer(e.target.value)}
                      className={inputClasses}
                      placeholder="Tu Respuesta"
                      required
                    />
                  </div>
                </>
              ) : (
                <p className="text-lg text-white mb-4 italic">No hay pregunta de seguridad configurada para este usuario.</p>
              )}
              {recoveryMessage && <p className="text-red-400 text-sm mb-4 text-center">{recoveryMessage}</p>}
              <button type="submit" className="w-full bg-[#f7ca18] text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-400" disabled={!selectedAdminForRecovery.securityQuestion}>Verificar Respuesta</button>
              <button type="button" onClick={resetRecovery} className="w-full mt-3 text-sm text-gray-400 hover:text-white">Cancelar</button>
            </form>
          )}
          {recoveryStep === 'showPassword' && selectedAdminForRecovery && (
            <div>
              <p className="text-gray-300 mb-2">Contraseña para <span className="font-bold text-yellow-400">{selectedAdminForRecovery.username}</span>:</p>
              <p className="text-2xl font-bold text-green-400 bg-black/20 p-3 rounded text-center my-4 break-all">{selectedAdminForRecovery.password || "No establecida"}</p>
              <p className="text-xs text-yellow-500 my-4 text-center">IMPORTANTE: Esta es una simulación. En una aplicación real, nunca se mostraría la contraseña directamente. Se enviaría un enlace de restablecimiento seguro.</p>
              <button type="button" onClick={resetRecovery} className="w-full bg-[#f7ca18] text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-400">Volver al Login</button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="adminLoginSection" className="admin-panel mt-12 mb-12 py-10">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-['Orbitron'] text-white">Iniciar Sesión como Administrador</h3>
        <p className="text-gray-400 mt-1">Accede para gestionar los sorteos.</p>
        <p className="text-xs text-yellow-500 mt-2">(Simulación: Usar credenciales de admin predefinidas)</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#2a1d5e] p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto"
      >
        <div className="mb-6">
          <input
            type="text"
            id="adminUser"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className={inputClasses}
            placeholder="Usuario (Ej: Saman)"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            id="adminPass"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className={inputClasses}
            placeholder="Contraseña"
            required
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white text-sm rounded-md text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-[#f7ca18] text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          Iniciar Sesión
        </button>
        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => setRecoveryStep('promptUsername')}
            className="text-sm text-yellow-400 hover:text-yellow-300 underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminLoginSection;