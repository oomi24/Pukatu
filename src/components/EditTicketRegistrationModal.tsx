import React, { useState, useEffect, useCallback } from 'react';
import type { TicketRegistration, PaymentMethod, PaymentStatus } from '../types';

interface EditTicketRegistrationModalProps {
  show: boolean;
  onClose: () => void;
  ticketRegistration: TicketRegistration | null;
  onSave: (updatedRegistration: TicketRegistration) => void;
  isRobleAdmin: boolean; // To control who can edit payment status
}

const EditTicketRegistrationModal: React.FC<EditTicketRegistrationModalProps> = ({ show, onClose, ticketRegistration, onSave, isRobleAdmin }) => {
  const [participantName, setParticipantName] = useState('');
  const [participantWhatsApp, setParticipantWhatsApp] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFormFields = useCallback(() => {
    if (ticketRegistration) {
      setParticipantName(ticketRegistration.participantName);
      setParticipantWhatsApp(ticketRegistration.participantWhatsApp);
      setTicketNumber(ticketRegistration.ticketNumber);
      setPaymentMethod(ticketRegistration.paymentMethod);
      setPaymentReference(ticketRegistration.paymentReference);
      setPaymentStatus(ticketRegistration.paymentStatus);
    } else {
      setParticipantName('');
      setParticipantWhatsApp('');
      setTicketNumber('');
      setPaymentMethod('');
      setPaymentReference('');
      setPaymentStatus('');
    }
    setErrorMessage(null);
  }, [ticketRegistration]);

  useEffect(() => {
    if (show) {
      resetFormFields();
    }
  }, [show, resetFormFields]);

  const validateTicketNumber = (num: string): boolean => {
    // For grid cards, ticket numbers can be comma separated list.
    // Allow digits, commas, spaces. Further validation for range can be complex here.
    if (!/^[0-9,\s]*$/.test(num) && num.trim() !== '') {
        setErrorMessage('Número(s) de ticket deben ser dígitos, opcionalmente separados por comas.');
        return false;
    }
    if (num.trim() === '') {
        setErrorMessage('El campo de número(s) de ticket no puede estar vacío.');
        return false;
    }
    setErrorMessage(null);
    return true;
};


  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value;
    setTicketNumber(num);
    validateTicketNumber(num);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketRegistration) return;
    setErrorMessage(null);

    if (!participantName.trim()) {
      setErrorMessage("El nombre del participante no puede estar vacío."); return;
    }
    if (!participantWhatsApp.trim()) {
      setErrorMessage("El WhatsApp del participante no puede estar vacío."); return;
    }
    if (!validateTicketNumber(ticketNumber)) return;
    
    if (!/^\d+$/.test(participantWhatsApp)) {
        setErrorMessage("El número de WhatsApp solo debe contener dígitos."); return;
    }
    if (!paymentMethod) {
        setErrorMessage("El método de pago es obligatorio."); return;
    }
    if (!paymentReference.trim()) {
        setErrorMessage("La referencia de pago es obligatoria."); return;
    }
    if (isRobleAdmin && !paymentStatus) {
        setErrorMessage("El estado del pago es obligatorio para el admin Roble."); return;
    }


    setIsLoading(true);

    const updatedRegistration: TicketRegistration = {
      ...ticketRegistration,
      participantName: participantName.trim(),
      participantWhatsApp: participantWhatsApp.trim(),
      ticketNumber: ticketNumber.trim(),
      paymentMethod: paymentMethod as PaymentMethod,
      paymentReference: paymentReference.trim(),
      paymentStatus: paymentStatus as PaymentStatus, // Ensure status is set
    };
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    onSave(updatedRegistration);
    setIsLoading(false);
    onClose(); 
  };

  if (!show || !ticketRegistration) {
    return null;
  }

  const inputClasses = "w-full px-3 py-2.5 bg-[#1a1a1a] text-white border border-gray-600 focus:border-[#f7ca18] focus:outline-none focus:ring-1 focus:ring-[#f7ca18] rounded-md placeholder-gray-500 text-sm";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1";
  const selectClasses = `${inputClasses} appearance-none`;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
      onClick={isLoading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editTicketRegModalLabel"
    >
      <div
        className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-purple-600/30">
          <h5 className="text-lg font-semibold font-['Orbitron'] text-[#f7ca18]" id="editTicketRegModalLabel">
            Editar Registro de Ticket
          </h5>
          <p className="text-xs text-gray-400 mt-1">Sorteo: {ticketRegistration.raffleName}</p>
          <p className="text-xs text-gray-500">ID Registro: {ticketRegistration.id}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label htmlFor="regParticipantName" className={labelClasses}>Nombre del Participante <span className="text-red-500">*</span></label>
            <input type="text" id="regParticipantName" value={participantName} onChange={(e) => setParticipantName(e.target.value)} className={inputClasses} placeholder="Ej: Ana Lucía Méndez" required disabled={isLoading}/>
          </div>
          
          <div>
            <label htmlFor="regParticipantWhatsApp" className={labelClasses}>WhatsApp del Participante <span className="text-red-500">*</span></label>
            <input type="tel" id="regParticipantWhatsApp" value={participantWhatsApp} onChange={(e) => setParticipantWhatsApp(e.target.value)} className={inputClasses} placeholder="Ej: 584121234567" required pattern="^\d+$" title="Solo números" disabled={isLoading}/>
          </div>

          <div>
            <label htmlFor="regTicketNumber" className={labelClasses}>Número(s) de Ticket (Ej: 007 o 5, 23, 100) <span className="text-red-500">*</span></label>
            <input 
                type="text" 
                id="regTicketNumber" 
                value={ticketNumber} 
                onChange={handleTicketNumberChange} 
                className={`${inputClasses} tracking-wider text-center font-mono`} 
                placeholder="007 ó 5, 23, 100" 
                required 
                disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="paymentMethodEdit" className={labelClasses}>Método de Pago <span className="text-red-500">*</span></label>
            <select 
                id="paymentMethodEdit" 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod | '')} 
                className={selectClasses} 
                required 
                disabled={isLoading || !isRobleAdmin} // Roble can change method if necessary
            >
                <option value="" disabled>Seleccione un método</option>
                <option value="Pago Móvil">Pago Móvil</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="paymentReferenceEdit" className={labelClasses}>Referencia/Nota de Pago <span className="text-red-500">*</span></label>
            <input 
                type="text" 
                id="paymentReferenceEdit" 
                value={paymentReference} 
                onChange={(e) => setPaymentReference(e.target.value)} 
                className={inputClasses} 
                placeholder="Ref. Pago Móvil o Nota de Efectivo" 
                required 
                disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="paymentStatusEdit" className={labelClasses}>Estado del Pago <span className="text-red-500">*</span></label>
            <select 
                id="paymentStatusEdit" 
                value={paymentStatus} 
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus | '')} 
                className={selectClasses} 
                required 
                disabled={isLoading || !isRobleAdmin} // Only Roble admin can change status
            >
                <option value="" disabled>Seleccione un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Validado">Validado</option>
                <option value="Rechazado">Rechazado</option>
            </select>
            {!isRobleAdmin && <p className="text-xs text-yellow-400 mt-1">Solo el Super Admin (Roble) puede cambiar el estado del pago.</p>}
          </div>
          
          <div className="text-xs text-gray-400">
            <p><strong>Fecha de Registro Original:</strong> {new Date(ticketRegistration.registrationDate).toLocaleString('es-VE', { dateStyle: 'long', timeStyle: 'short' })}</p>
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

export default EditTicketRegistrationModal;