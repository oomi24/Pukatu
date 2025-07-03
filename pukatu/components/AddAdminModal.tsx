import React, { useState, useEffect, useCallback } from 'react';
import type { AdminAccount, UUID } from '../types';

interface AddAdminModalProps {
  show: boolean;
  onClose: () => void;
  onAddAdmin: (newAdmin: AdminAccount) => void;
  existingUsernames: string[];
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ show, onClose, onAddAdmin, existingUsernames }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFormFields = useCallback(() => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setWhatsAppNumber('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (show) {
      resetFormFields();
    }
  }, [show, resetFormFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim() || !displayName.trim()) {
      setErrorMessage("Usuario, contraseña y nombre visible son obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    if (existingUsernames.map(u => u.toLowerCase()).includes(username.trim().toLowerCase())) {
        setErrorMessage("Este nombre de usuario ya existe. Por favor, elige otro.");
        return;
    }
    if (whatsAppNumber && !/^\d+$/.test(whatsAppNumber)) {
        setErrorMessage("El número de WhatsApp solo debe contener dígitos.");
        return;
    }
    if ((securityQuestion && !securityAnswer) || (!securityQuestion && securityAnswer)) {
        setErrorMessage("Si provee una pregunta de seguridad, debe proveer una respuesta, y viceversa.");
        return;
    }


    setIsLoading(true);

    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}-${username.trim().toLowerCase()}`, // Generate unique ID
      username: username.trim(),
      password: password, // In a real app, hash this password
      displayName: displayName.trim(),
      whatsAppNumber: whatsAppNumber.trim() || undefined,
      securityQuestion: securityQuestion.trim() || undefined,
      securityAnswer: securityAnswer.trim() || undefined,
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    onAddAdmin(newAdmin);
    setIsLoading(false);
    onClose(); 
  };

  if (!show) {
    return null;
  }

  const inputClasses = "w-full px-3 py-2.5 bg-[#1a1a1a] text-white border border-gray-600 focus:border-[#f7ca18] focus:outline-none focus:ring-1 focus:ring-[#f7ca18] rounded-md placeholder-gray-500 text-sm";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1";
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
      onClick={isLoading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="addAdminModalLabel"
    >
      <div
        className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-purple-600/30">
          <h5 className="text-lg font-semibold font-['Orbitron'] text-[#f7ca18]" id="addAdminModalLabel">
            Agregar Nuevo Administrador
          </h5>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3">
          <div>
            <label htmlFor="adminUsername" className={labelClasses}>Nombre de Usuario (para login) <span className="text-red-500">*</span></label>
            <input type="text" id="adminUsername" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClasses} placeholder="Ej: nuevo_admin" required disabled={isLoading}/>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="adminPassword" className={labelClasses}>Contraseña <span className="text-red-500">*</span></label>
              <input type="password" id="adminPassword" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="Mínimo 6 caracteres" required minLength={6} disabled={isLoading}/>
            </div>
            <div>
              <label htmlFor="adminConfirmPassword" className={labelClasses}>Confirmar Contraseña <span className="text-red-500">*</span></label>
              <input type="password" id="adminConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} placeholder="Repetir contraseña" required minLength={6} disabled={isLoading}/>
            </div>
          </div>

          <div>
            <label htmlFor="adminDisplayName" className={labelClasses}>Nombre Visible (para mostrar) <span className="text-red-500">*</span></label>
            <input type="text" id="adminDisplayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClasses} placeholder="Ej: Administrador Ventas" required disabled={isLoading}/>
          </div>
          
          <div>
            <label htmlFor="adminWhatsApp" className={labelClasses}>Número de WhatsApp (Opcional, Ej: 584120000000)</label>
            <input type="tel" id="adminWhatsApp" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} className={inputClasses} placeholder="Solo números" pattern="^\d*$" title="Solo números" disabled={isLoading}/>
          </div>
          
          <div className="pt-2 space-y-1">
             <p className={`${labelClasses} text-gray-400`}>Pregunta y Respuesta de Seguridad (Opcional, para recuperación)</p>
             <div>
                <label htmlFor="adminSecQuestion" className={labelClasses}>Pregunta de Seguridad</label>
                <input type="text" id="adminSecQuestion" value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} className={inputClasses} placeholder="Ej: ¿Nombre de tu primera mascota?" disabled={isLoading}/>
            </div>
            <div>
                <label htmlFor="adminSecAnswer" className={labelClasses}>Respuesta de Seguridad</label>
                <input type="text" id="adminSecAnswer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} className={inputClasses} placeholder="Ej: Firulais" disabled={isLoading}/>
            </div>
          </div>


          {errorMessage && (
            <div className="p-3 rounded-md text-sm text-center bg-red-700 text-white">
              {errorMessage}
            </div>
          )}

          <div className="pt-3">
            <button type="submit" disabled={isLoading} className="w-full bg-[#f7ca18] text-black font-bold py-2.5 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? 'Agregando...' : 'Agregar Administrador'}
            </button>
          </div>
        </form>

        <div className="p-4 border-t border-purple-600/30 text-right mt-auto">
          <button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-60">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
