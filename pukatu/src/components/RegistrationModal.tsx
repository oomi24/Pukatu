



import React, { useState, useEffect, useCallback } from 'react';
import type { TicketRegistration, PaymentMethod } from '../types';

interface SimplifiedRaffleItem {
  id: string;
  raffleTitle: string; 
  administratorWhatsApp?: string;
  ticketCost?: number;
  managedByAdminId?: string;
  raffleType: 'grid' | 'main_draw' | 'quick_raffle'; 
  selectedGridNumbers?: number[]; 
}

interface RegistrationModalProps {
  show: boolean;
  onClose: () => void;
  raffleItem: SimplifiedRaffleItem;
  onAddTicketRegistration: (registration: TicketRegistration) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ show, onClose, raffleItem, onAddTicketRegistration }) => {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  const [paymentMethodInput, setPaymentMethodInput] = useState<PaymentMethod | ''>('');
  const [paymentReferenceInput, setPaymentReferenceInput] = useState('');
  
  const [chosenTicketNumber, setChosenTicketNumber] = useState(''); 
  const [ticketNumberError, setTicketNumberError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<'success' | 'error' | 'info' | null>(null);

  const modalTitle = raffleItem.raffleTitle;
  const isMainRaffle = raffleItem.raffleType === 'main_draw';
  const isQuickRaffle = raffleItem.raffleType === 'quick_raffle';

  const resetForm = useCallback(() => {
    setFullName('');
    setWhatsapp('');
    setPaymentMethodInput('');
    setPaymentReferenceInput('');
    setChosenTicketNumber('');
    setTicketNumberError(null);
  }, []);

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        resetForm();
        setSubmitMessage(null); 
        setSubmitMessageType(null);
      }, 300); 
    } else {
        if (raffleItem.raffleType === 'grid' && raffleItem.selectedGridNumbers && raffleItem.selectedGridNumbers.length > 0) {
            setChosenTicketNumber(raffleItem.selectedGridNumbers.join(', ')); 
        } else {
            setChosenTicketNumber(''); 
        }
    }
  }, [show, resetForm, raffleItem]);

  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value;
    setChosenTicketNumber(num);
    if (num === '' || /^[0-9,\s]*$/.test(num)) {
        setTicketNumberError(null);
    } else {
        setTicketNumberError('Solo números y comas para la cuadrícula.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setSubmitMessage(null); setSubmitMessageType(null); setTicketNumberError(null);

    let finalTicketNumbersStr: string[] = [];
    let ticketNumberForDb: string = 'N/A';
    let totalCost = raffleItem.ticketCost;

    if (isMainRaffle) {
      ticketNumberForDb = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    } else if (isQuickRaffle) {
      ticketNumberForDb = 'QUICKPLAY'; // Placeholder, result determined on validation
    }
    else { // Grid raffle logic
      if (raffleItem.selectedGridNumbers && raffleItem.selectedGridNumbers.length > 0) {
          finalTicketNumbersStr = raffleItem.selectedGridNumbers.map(n => n.toString());
      } else if (chosenTicketNumber.trim() !== '') {
          finalTicketNumbersStr = chosenTicketNumber.trim().split(/[\s,]+/).filter(n => /^\d+$/.test(n) && parseInt(n,10) > 0);
          if (finalTicketNumbersStr.length === 0 && chosenTicketNumber.trim() !== '') {
              setTicketNumberError('Formato de números inválido. Use números separados por coma.'); 
              setIsLoading(false); return;
          }
      } else {
           setTicketNumberError('Por favor, selecciona números de la cuadrícula o introduce uno manualmente.'); 
           setIsLoading(false); return;
      }
      if (finalTicketNumbersStr.length === 0) {
          setSubmitMessage('No se ha definido ningún número de ticket válido.');
          setSubmitMessageType('error'); setIsLoading(false); return;
      }
      ticketNumberForDb = finalTicketNumbersStr.join(', ');
      if (raffleItem.ticketCost) {
        totalCost = raffleItem.ticketCost * finalTicketNumbersStr.length;
      }
    }

    if (!fullName || !whatsapp || !paymentMethodInput || !paymentReferenceInput) {
      setSubmitMessage('Todos los campos son obligatorios, incluyendo método y referencia de pago.');
      setSubmitMessageType('error'); setIsLoading(false); return;
    }
    if (!raffleItem.administratorWhatsApp || !raffleItem.managedByAdminId) {
      setSubmitMessage(`Admin no configurado o no identificado para "${modalTitle}".`);
      setSubmitMessageType('error'); setIsLoading(false); return;
    }
    
    const newRegistration: TicketRegistration = {
      id: Date.now().toString(),
      raffleId: raffleItem.id,
      raffleName: modalTitle,
      participantName: fullName,
      participantWhatsApp: whatsapp,
      ticketNumber: ticketNumberForDb, 
      registrationDate: new Date().toISOString(),
      paymentMethod: paymentMethodInput as PaymentMethod,
      paymentReference: paymentReferenceInput,
      paymentStatus: 'Pendiente',
      managedByAdminId: raffleItem.managedByAdminId,
    };
    onAddTicketRegistration(newRegistration); 

    let ticketCostInfo = totalCost !== undefined ? ` (Costo: $${totalCost.toFixed(2)})` : '';
    let ticketSelectionInfo = isMainRaffle || isQuickRaffle ? '' : `Número(s) Adquirido(s): ${ticketNumberForDb}`;
    let raffleNameMessage = `*Nuevo Registro para ${modalTitle}${ticketCostInfo}*`;
    
    const messageParts = [
      raffleNameMessage,
      `Participante: ${fullName}`, `WhatsApp: ${whatsapp}`,
      ticketSelectionInfo,
      `Método de Pago: ${paymentMethodInput}`,
      `Referencia/Nota: ${paymentReferenceInput}`,
      `Estado del Pago: PENDIENTE DE VALIDACIÓN`
    ].filter(Boolean); // Filter out empty strings like ticketSelectionInfo

    const encodedMessage = encodeURIComponent(messageParts.join('\n\n'));
    const cleanedAdminWhatsApp = raffleItem.administratorWhatsApp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanedAdminWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setSubmitMessage(`¡Registro enviado para validación! Serás redirigido a WhatsApp.`);
    setSubmitMessageType('info'); setIsLoading(false);
  };

  if (!show) return null;

  const inputClasses = "w-full px-4 py-3 bg-[#1a1a1a] text-white border-b-2 border-[#f7ca18] focus:outline-none focus:border-yellow-300 rounded-t-md placeholder-gray-500 text-sm";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1";
  const selectClasses = `${inputClasses} appearance-none`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-2 sm:p-4" onClick={isLoading ? undefined : onClose} role="dialog">
      <div className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-md w-full max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-purple-600/30">
          <h5 className="text-lg font-semibold font-['Orbitron'] text-[#f7ca18]" id="registrationModalLabel">Registro para: <span className="text-white">{modalTitle}</span>
            {raffleItem.ticketCost !== undefined && (<span className="block text-xs text-yellow-300 mt-1">Costo: ${raffleItem.ticketCost.toFixed(2)} {(raffleItem.raffleType === 'grid' ? '(por número)' : '(por participación)')}</span>)}
          </h5>
          <p className="text-xs text-gray-400 mt-1">Completa datos y detalles de pago. Serás redirigido a WhatsApp para notificar al admin.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-5 overflow-y-auto space-y-3 flex-grow">
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClasses} placeholder="Nombre Completo *" required disabled={isLoading}/>
          <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClasses} placeholder="Tu Número de WhatsApp *" required disabled={isLoading}/>
          
          {isMainRaffle ? (
             <div className="text-center p-3 bg-black/20 rounded-md">
                <p className={labelClasses}>Ticket Sorteo Principal</p>
                <p className="text-sm text-gray-300">Se te asignará un número de 4 dígitos al azar al validar tu pago.</p>
             </div>
          ) : isQuickRaffle ? (
             <div className="text-center p-3 bg-black/20 rounded-md">
                <p className={labelClasses}>Participación en Sorteo Rápido</p>
                <p className="text-sm text-gray-300">¡Tu premio se revelará una vez que el admin valide tu pago!</p>
             </div>
          ) : (raffleItem.selectedGridNumbers && raffleItem.selectedGridNumbers.length > 0) ? (
            <div>
                <p className={labelClasses}>Números Seleccionados de Cuadrícula:</p>
                <p className="text-lg font-['Orbitron'] text-[#f7ca18] text-center bg-black/20 p-2 rounded break-all">{raffleItem.selectedGridNumbers.join(', ')}</p>
            </div>
          ) : (
             <div>
                <label htmlFor="chosenTicketNumberGridManual" className={labelClasses}>Ingresa Número(s) de Cuadrícula (separados por coma) <span className="text-red-500">*</span></label>
                <input type="text" id="chosenTicketNumberGridManual" value={chosenTicketNumber} onChange={handleTicketNumberChange} className={`${inputClasses} text-center`} placeholder="Ej: 5, 23, 100" required disabled={isLoading}/>
                {ticketNumberError && <p className="text-xs text-red-400 mt-1">{ticketNumberError}</p>}
             </div>
           )}

          <div>
            <label htmlFor="paymentMethod" className={labelClasses}>Método de Pago <span className="text-red-500">*</span></label>
            <select 
                id="paymentMethod" 
                value={paymentMethodInput} 
                onChange={(e) => setPaymentMethodInput(e.target.value as PaymentMethod | '')} 
                className={selectClasses} 
                required 
                disabled={isLoading}
            >
                <option value="" disabled>Seleccione un método</option>
                <option value="Pago Móvil">Pago Móvil</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Otro">Otro</option>
            </select>
          </div>

          {paymentMethodInput && (
            <div>
              <label htmlFor="paymentReference" className={labelClasses}>
                {paymentMethodInput === 'Pago Móvil' ? 'Número de Referencia (Pago Móvil)' : 
                 paymentMethodInput === 'Efectivo' ? 'Notas de Pago en Efectivo (Ej: Entregado a Admin X)' :
                 'Detalles del Pago'} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="paymentReference" 
                value={paymentReferenceInput} 
                onChange={(e) => setPaymentReferenceInput(e.target.value)} 
                className={inputClasses} 
                placeholder={
                    paymentMethodInput === 'Pago Móvil' ? 'Ej: 000123456789' : 
                    paymentMethodInput === 'Efectivo' ? 'Ej: Entregado a Pedro Pérez el 15/07' :
                    'Especifique los detalles aquí'
                } 
                required 
                disabled={isLoading}
              />
            </div>
          )}
          
          {submitMessage && (<div className={`p-3 rounded-md text-sm text-center ${submitMessageType === 'info' ? 'bg-blue-600 text-white' : submitMessageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{submitMessage}</div>)}
          
          <div className="pt-2">
            <button 
                type="submit" 
                disabled={isLoading || !raffleItem.administratorWhatsApp || !raffleItem.managedByAdminId || !paymentMethodInput} 
                className="w-full bg-[#f7ca18] text-black font-bold py-2.5 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Confirmar y Notificar por WhatsApp'}
            </button>
          </div>
        </form>
        <div className="p-3 sm:p-4 border-t border-purple-600/30 text-right mt-auto">
          <button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-500 transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
export default RegistrationModal;