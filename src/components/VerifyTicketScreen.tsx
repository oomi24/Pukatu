import React, { useState } from 'react';
import type { MockUser, RaffleItem, UserTicketsViewData } from '../types';
import { mockUsers } from './UserMockData'; // Import mock users from centralized file

interface VerifyTicketScreenProps {
  raffleItems: RaffleItem[];
}

const VerifyTicketScreen: React.FC<VerifyTicketScreenProps> = ({ raffleItems }) => {
  const [whatsappNumberInput, setWhatsappNumberInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | UserTicketsViewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyTicketsByWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumberInput.trim()) {
      setVerificationResult('Por favor, introduce tu número de WhatsApp.');
      return;
    }
    setIsLoading(true);
    setVerificationResult(null);

    setTimeout(() => {
      const normalizedWhatsApp = whatsappNumberInput.trim().replace(/\D/g, ''); // Clean non-digits
      const user = mockUsers.find(u => u.whatsappNumber.replace(/\D/g, '') === normalizedWhatsApp);

      if (!user) {
        setVerificationResult('Número de WhatsApp no encontrado en nuestros registros.');
        setIsLoading(false);
        return;
      }

      if (user.tickets.length === 0) {
        setVerificationResult(`${user.name}, aún no tienes tickets comprados registrados con este número de WhatsApp.`);
        setIsLoading(false);
        return;
      }

      const groupedTickets = user.tickets.reduce((acc, userTicket) => {
        const raffle = raffleItems.find(r => r.id === userTicket.raffleId);
        if (raffle) {
          acc.push({
            raffle,
            ticketNumbers: userTicket.ticketNumbers,
          });
        }
        return acc;
      }, [] as UserTicketsViewData['groupedTickets']);
      
      setVerificationResult({ user, groupedTickets });
      setIsLoading(false);
    }, 1500);
  };
  
  const inputClasses = "w-full px-4 py-3 bg-[#1a1a1a] text-white border-b-2 border-[#f7ca18] focus:outline-none focus:border-yellow-300 rounded-t-md placeholder-gray-500 text-center text-lg";

  const UserTicketsDisplay: React.FC<{ data: UserTicketsViewData }> = ({ data }) => {
    return (
      <div className="mt-6 p-5 bg-gradient-to-br from-[#2f2069] to-[#251a52] rounded-lg shadow-xl border border-purple-700/60">
        <h3 className="text-xl font-['Orbitron'] text-green-400 mb-1 text-center">Tickets de: {data.user.name}</h3>
        <p className="text-sm text-center text-gray-400 mb-5">(WhatsApp: {data.user.whatsappNumber})</p>
        
        {data.groupedTickets.length === 0 ? (
           <p className="text-center text-gray-300 py-4">No se encontraron tickets para los sorteos activos listados.</p>
        ) : (
            <div className="space-y-4">
            {data.groupedTickets.map(({ raffle, ticketNumbers }, index) => {
                const isRafflePast = raffle.targetDate ? new Date(raffle.targetDate).getTime() < Date.now() : false;
                const statusText = isRafflePast ? "Sorteo Finalizado" : "Participando";
                const statusColor = isRafflePast ? "text-gray-400" : "text-green-400";
                return (
                <div key={`${raffle.id}-${index}`} className="p-2.5 bg-black/25 rounded-lg shadow-md border border-purple-600/40 flex gap-2 items-start">
                  <img 
                    src={raffle.imageUrl} 
                    alt={`Imagen de ${raffle.name || 'Sorteo'}`} 
                    className="w-16 h-20 object-cover rounded shadow-sm border border-purple-500/30 flex-shrink-0"
                  />
                  <div className="flex-grow text-left">
                    <p className="font-semibold text-base text-purple-200 mb-1.5 leading-tight">{raffle.name || `Sorteo ID ${raffle.id}`}</p>
                    <p className="text-xs mb-1">
                      <strong className="text-gray-400">Tus Números:</strong> 
                      <span className="font-bold text-xl text-[#f7ca18] ml-1">{ticketNumbers.join(', ')}</span>
                    </p>
                    <p className="text-xs mb-1"><strong className="text-gray-400">Fecha Sorteo:</strong> <span className="text-gray-300">{raffle.date}</span></p>
                    <p className="mt-1.5">
                      <strong className="text-gray-400 text-xs">Estado:</strong> 
                      <span className={`${statusColor} font-semibold text-sm ml-1`}>{statusText}</span>
                    </p>
                  </div>
                </div>
                );
            })}
            </div>
        )}
      </div>
    );
  };

  return (
    <section className="verify-ticket-screen mt-12 mb-12 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-['Orbitron'] text-white">Consulta Tus Tickets Comprados</h2>
        <p className="text-gray-400 mt-1">Introduce tu número de WhatsApp para ver todos tus tickets.</p>
      </div>
      <form
        onSubmit={handleVerifyTicketsByWhatsApp}
        className="bg-[#2a1d5e] p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto"
      >
        <div className="mb-6">
            <label htmlFor="whatsappNumberInput" className="block text-sm font-medium text-gray-300 mb-1 text-center">Tu Número de WhatsApp</label>
            <input
                type="tel" 
                id="whatsappNumberInput"
                value={whatsappNumberInput}
                onChange={(e) => setWhatsappNumberInput(e.target.value)}
                className={inputClasses}
                placeholder="Ej: 584121234567"
                required
            />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#f7ca18] text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Consultando...' : 'Ver Mis Tickets'}
        </button>

        {verificationResult && !isLoading && (
          typeof verificationResult === 'string' ? (
            <div className={`mt-6 p-4 rounded-md text-center text-sm ${
                verificationResult.includes("no encontrado") || verificationResult.includes("Por favor") ? 'bg-red-500' : 'bg-yellow-600'
            } text-white`}>
              {verificationResult}
            </div>
          ) : (
            <UserTicketsDisplay data={verificationResult} />
          )
        )}
      </form>
       <p className="text-xs text-gray-500 mt-8 text-center">
        Esta es una simulación con datos de ejemplo. La verificación y consulta real requiere conexión a una base de datos.
      </p>
    </section>
  );
};

export default VerifyTicketScreen;