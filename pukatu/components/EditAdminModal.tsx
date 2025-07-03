
import React, { useState, useEffect, useCallback } from 'react';
import type { AdminAccount } from '../types';

interface EditAdminModalProps {
  show: boolean;
  onClose: () => void;
  adminAccount: AdminAccount | null;
  onSave: (updatedAdmin: AdminAccount) => void;
  existingUsernames: string[]; // To check for username conflicts if username were editable (currently not)
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({ show, onClose, adminAccount, onSave, existingUsernames }) => {
  const [username, setUsername] = useState(''); // Username is not editable but shown
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFormFields = useCallback(() => {
    if (adminAccount) {
      setUsername(adminAccount.username);
      setDisplayName(adminAccount.displayName);
      setWhatsAppNumber(adminAccount.whatsAppNumber || '');
      setSecurityQuestion(adminAccount.securityQuestion || '');
      setSecurityAnswer(adminAccount.securityAnswer || '');
    } else {
      setUsername('');
      setDisplayName('');
      setWhatsAppNumber('');
      setSecurityQuestion('');
      setSecurityAnswer('');
    }
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage(null);
  }, [adminAccount]);

  useEffect(() => {
    if (show) {
      resetFormFields();
    }
  }, [show, resetFormFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAccount) return;
    setErrorMessage(null);

    if (!displayName.trim()) {
      setErrorMessage("El nombre visible es obligatorio.");
      return;
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      setErrorMessage("Las nuevas contraseñas no coinciden.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setErrorMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (whatsAppNumber && !/^\d*$/.test(whatsAppNumber)) { // Allow empty or digits only
        setErrorMessage("El número de WhatsApp solo debe contener dígitos (o estar vacío).");
        return;
    }
    if ((securityQuestion && !securityAnswer) || (!securityQuestion && securityAnswer)) {
        setErrorMessage("Si provee una pregunta de seguridad, debe proveer una respuesta, y viceversa.");
        return;
    }

    setIsLoading(true);

    const updatedAdminData: Partial<AdminAccount> = {
      displayName: displayName.trim(),
      whatsAppNumber: whatsAppNumber.trim() || undefined,
      securityQuestion: securityQuestion.trim() || undefined,
      securityAnswer: securityAnswer.trim() || undefined,
    };

    if (newPassword) {
      updatedAdminData.password = newPassword; // In a real app, hash this
    }

    const finalAdminAccount: AdminAccount = {
      ...adminAccount,
      ...updatedAdminData,
    };
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    onSave(finalAdminAccount);
    setIsLoading(false);
    onClose(); 
  };

  if (!show || !adminAccount) {
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
      aria-labelledby="editAdminModalLabel"
    >
      <div
        className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-purple-600/30">
          <h5 className="text-lg font-semibold font-['Orbitron'] text-[#f7ca18]" id="editAdminModalLabel">
            Editar Administrador: <span className="text-white">{adminAccount.username}</span>
          </h5>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3">
          <div>
            <label htmlFor="adminUsernameView" className={labelClasses}>Nombre de Usuario (Login)</label>
            <input type="text" id="adminUsernameView" value={username} className={`${inputClasses} bg-gray-700 cursor-not-allowed`} readOnly disabled/>
             <p className="text-xs text-gray-400 mt-1">El nombre de usuario no se puede cambiar.</p>
          </div>
          
          <div>
            <label htmlFor="editAdminDisplayName" className={labelClasses}>Nombre Visible (para mostrar) <span className="text-red-500">*</span></label>
            <input type="text" id="editAdminDisplayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClasses} placeholder="Ej: Administrador Ventas" required disabled={isLoading}/>
          </div>

          <div className="pt-2 space-y-1">
             <p className={`${labelClasses} text-gray-400`}>Cambiar Contraseña (Opcional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label htmlFor="editAdminNewPassword" className={labelClasses}>Nueva Contraseña</label>
                <input type="password" id="editAdminNewPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClasses} placeholder="Dejar en blanco para no cambiar" minLength={6} disabled={isLoading}/>
                </div>
                <div>
                <label htmlFor="editAdminConfirmNewPassword" className={labelClasses}>Confirmar Nueva Contraseña</label>
                <input type="password" id="editAdminConfirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputClasses} placeholder="Repetir nueva contraseña" minLength={6} disabled={isLoading || !newPassword}/>
                </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="editAdminWhatsApp" className={labelClasses}>Número de WhatsApp (Opcional, Ej: 584120000000)</label>
            <input type="tel" id="editAdminWhatsApp" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} className={inputClasses} placeholder="Solo números" pattern="^\d*$" title="Solo números o vacío" disabled={isLoading}/>
          </div>
          
          <div className="pt-2 space-y-1">
             <p className={`${labelClasses} text-gray-400`}>Pregunta y Respuesta de Seguridad (Opcional)</p>
             <div>
                <label htmlFor="editAdminSecQuestion" className={labelClasses}>Pregunta de Seguridad</label>
                <input type="text" id="editAdminSecQuestion" value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} className={inputClasses} placeholder="Ej: ¿Nombre de tu primera mascota?" disabled={isLoading}/>
            </div>
            <div>
                <label htmlFor="editAdminSecAnswer" className={labelClasses}>Respuesta de Seguridad</label>
                <input type="text" id="editAdminSecAnswer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} className={inputClasses} placeholder="Ej: Firulais" disabled={isLoading}/>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-md text-sm text-center bg-red-700 text-white">
              {errorMessage}
            </div>
          )}

          <div className="pt-3">
            <button type="submit" disabled={isLoading} className="w-full bg-[#f7ca18] text-black font-bold py-2.5 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? 'Guardando Cambios...' : 'Guardar Cambios'}
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

export default EditAdminModal;
