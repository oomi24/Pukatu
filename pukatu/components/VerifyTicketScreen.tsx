



import React, { useState } from 'react';
import type { MockUser, RaffleItem, UserTicketsViewData, TicketRegistration } from '../types';
import { mockUsers } from './UserMockData';
import QuickRafflePlayerModal from './QuickRafflePlayerModal';
import LeverIcon from './icons/LeverIcon';

interface VerifyTicketScreenProps {
  raffleItems: RaffleItem[];
  ticketRegistrations: TicketRegistration[];
  onUpdateTicketRegistration: (updatedRegistration: TicketRegistration) => void;
}

const VerifyTicketScreen: React.FC<VerifyTicketScreenProps> = ({ raffleItems, ticketRegistrations, onUpdateTicketRegistration }) => {
  const [whatsappNumberInput, setWhatsappNumberInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | UserTicketsViewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playingTicket, setPlayingTicket] = useState<TicketRegistration | null>(null);

  const handleVerifyTicketsByWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumberInput.trim()) {
      setVerificationResult('Por favor, introduce tu número de WhatsApp.');
      return;
    }
    setIsLoading(true);
    setVerificationResult(null);

    setTimeout(() => {
      const normalizedWhatsApp = whatsappNumberInput.trim().replace(/\D/g, '');
      
      const mainRaffleTickets = ticketRegistrations
        .filter(r => r.participantWhatsApp.replace(/\D/g, '') === normalizedWhatsApp && r.raffleId === 'main_raffle' && r.paymentStatus === 'Validado')
        .map(r => r.ticketNumber);

      const quickRafflePlays = ticketRegistrations
        .filter(r => r.participantWhatsApp.replace(/\D/g, '') === normalizedWhatsApp && r.raffleId === 'quick_raffle');

      const userFromMock = mockUsers.find(u => u.whatsappNumber.replace(/\D/g, '') === normalizedWhatsApp);

      if (!userFromMock && mainRaffleTickets.length === 0 && quickRafflePlays.length === 0) {
        setVerificationResult('Número de WhatsApp no encontrado en nuestros registros.');
        setIsLoading(false);
        return;
      }

      const userName = userFromMock ? userFromMock.name : ticketRegistrations.find(r => r.participantWhatsApp.replace(/\D/g, '') === normalizedWhatsApp)?.participantName || 'Participante';

      let groupedTickets: UserTicketsViewData['groupedTickets'] = [];

      if (userFromMock) {
          userFromMock.tickets.forEach(userTicket => {
              const raffle = raffleItems.find(r => r.id === userTicket.raffleId);
              if (raffle) {
                  groupedTickets.push({
                      raffle,
                      ticketNumbers: userTicket.ticketNumbers,
                  });
              }
          });
      }

      if (mainRaffleTickets.length > 0) {
          const mainRafflePseudoItem: RaffleItem = {
              id: 'main_raffle',
              raffleType: 'grid',
              name: 'Sorteo Principal PUKATU',
              raffleTitle: 'Sorteo Principal PUKATU',
              imageUrl: 'https://picsum.photos/seed/mainraffle/300/120',
              date: 'Ver Fecha Principal',
              prizeDetails: ["Premio Mayor del Sorteo Principal"],
              ticketPurchaseLink: '#', ticketCheckLink: '#', day: '', month: '', progressPercentage: 0, gridNumbersTotal: 9999,
          };
          groupedTickets.push({
              raffle: mainRafflePseudoItem,
              ticketNumbers: mainRaffleTickets,
          });
      }
      
      if (groupedTickets.length === 0 && quickRafflePlays.length === 0) {
        setVerificationResult(`${userName}, aún no tienes tickets comprados registrados con este número de WhatsApp.`);
      } else {
        const resultData: UserTicketsViewData = {
            user: {
                id: userFromMock?.id || 'reg_user',
                name: userName,
                whatsappNumber: whatsappNumberInput.trim(),
                tickets: userFromMock?.tickets || []
            },
            groupedTickets,
            quickRafflePlays: quickRafflePlays.sort((a,b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
        };
        setVerificationResult(resultData);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handlePlayComplete = (updatedTicket: TicketRegistration) => {
    onUpdateTicketRegistration(updatedTicket);
    setPlayingTicket(null);

    // Refresh the view with the updated data
    if (verificationResult && typeof verificationResult !== 'string') {
        const updatedPlays = verificationResult.quickRafflePlays.map(p => p.id === updatedTicket.id ? updatedTicket : p);
        setVerificationResult({
            ...verificationResult,
            quickRafflePlays: updatedPlays,
        });
    }
  };
  
  const inputClasses = "w-full px-4 py-3 bg-[#1a1a1a] text-white border-b-2 border-[#f7ca18] focus:outline-none focus:border-yellow-300 rounded-t-md placeholder-gray-500 text-center text-lg";

  const UserTicketsDisplay: React.FC<{ data: UserTicketsViewData }> = ({ data }) => {
    return (
      <div className="mt-6 p-5 bg-gradient-to-br from-[#2f2069] to-[#251a52] rounded-lg shadow-xl border border-purple-700/60">
        <h3 className="text-xl font-['Orbitron'] text-green-400 mb-1 text-center">Tickets de: {data.user.name}</h3>
        <p className="text-sm text-center text-gray-400 mb-5">(WhatsApp: {data.user.whatsappNumber})</p>
        
        <div className="space-y-4">
            {data.quickRafflePlays.length > 0 && (
                <div>
                    <h4 className="text-lg text-purple-300 font-semibold mb-2 text-center border-b border-purple-400/30 pb-1">Resultados Sorteo Rápido</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {data.quickRafflePlays.map((play) => {
                          let statusContent;
                          if (play.paymentStatus === 'Validado') {
                              if (play.hasBeenPlayed) {
                                const prizeText = play.prizeWon! > 0 ? `¡Ganaste $${play.prizeWon!.toFixed(2)}!` : 'Mejor suerte la próxima vez.';
                                const prizeColor = play.prizeWon! > 0 ? 'text-green-400' : 'text-gray-300';
                                statusContent = <p className={`mt-1.5 font-bold text-lg ${prizeColor}`}>{prizeText}</p>;
                              } else {
                                statusContent = (
                                    <button 
                                        onClick={() => setPlayingTicket(play)}
                                        className="mt-2 w-full flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors"
                                    >
                                        <LeverIcon className="w-5 h-5"/>
                                        ¡JUGAR AHORA!
                                    </button>
                                );
                              }
                          } else if (play.paymentStatus === 'Pendiente') {
                              statusContent = <p className="mt-1.5 font-bold text-lg text-yellow-500">Pago pendiente de validación</p>;
                          } else { // Rechazado
                              statusContent = <p className="mt-1.5 font-bold text-lg text-red-500">Pago rechazado</p>;
                          }
                          
                          return (
                              <div key={play.id} className="p-2.5 bg-black/25 rounded-lg shadow-md border border-purple-600/40 flex flex-col gap-2 items-center">
                                  <div className="flex-grow text-center">
                                      <p className="font-semibold text-base text-purple-200 leading-tight">Jugada Sorteo Rápido</p>
                                      <p className="text-xs text-gray-400">Fecha: {new Date(play.registrationDate).toLocaleString('es-VE')}</p>
                                  </div>
                                  {statusContent}
                              </div>
                          );
                      })}
                    </div>
                </div>
            )}

            {data.groupedTickets.length > 0 && (
                <div className="pt-4">
                     <h4 className="text-lg text-purple-300 font-semibold mb-2 text-center border-b border-purple-400/30 pb-1">Tickets de Sorteos de Rejilla</h4>
                     {data.groupedTickets.map(({ raffle, ticketNumbers }, index) => {
                        const isRafflePast = raffle.isGridCardDrawComplete || (raffle.targetDate ? new Date(raffle.targetDate).getTime() < Date.now() : false);
                        let statusText = isRafflePast ? "Sorteo Finalizado" : "Participando";
                        let statusColor = isRafflePast ? "text-gray-400" : "text-green-400";
                        if(raffle.isGridCardDrawComplete && raffle.gridCardWinningNumber && ticketNumbers.includes(raffle.gridCardWinningNumber)) {
                            statusText = `¡GANASTE CON EL ${raffle.gridCardWinningNumber}!`;
                            statusColor = 'text-yellow-400 animate-pulse';
                        }

                        return (
                        <div key={`${raffle.id}-${index}`} className="p-2.5 bg-black/25 rounded-lg shadow-md border border-purple-600/40 flex gap-2 items-start mt-3">
                        <img 
                            src={raffle.imageUrl} 
                            alt={`Imagen de ${raffle.raffleTitle}`} 
                            className="w-16 h-20 object-cover rounded shadow-sm border border-purple-500/30 flex-shrink-0"
                        />
                        <div className="flex-grow text-left">
                            <p className="font-semibold text-base text-purple-200 mb-1.5 leading-tight">{raffle.raffleTitle}</p>
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

            {(data.groupedTickets.length === 0 && data.quickRafflePlays.length === 0) && (
                <p className="text-center text-gray-300 py-4">No se encontraron tickets para los sorteos activos listados.</p>
            )}
        </div>
      </div>
    );
  };

  return (
    <>
    <section className="verify-ticket-screen mt-12 mb-12 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-['Orbitron'] text-white">Consulta Tus Tickets y Jugadas</h2>
        <p className="text-gray-400 mt-1">Introduce tu número de WhatsApp para ver todos tus tickets y resultados.</p>
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
        Los datos de tickets de cuadrícula son de ejemplo; los del sorteo principal y rápido provienen de sus registros en la app.
      </p>
    </section>
    {playingTicket && (
        <QuickRafflePlayerModal
            show={!!playingTicket}
            onClose={() => setPlayingTicket(null)}
            ticket={playingTicket}
            onPlayComplete={handlePlayComplete}
        />
    )}
    </>
  );
};

export default VerifyTicketScreen;