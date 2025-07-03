import React, { useState, useEffect, useMemo } from 'react';
import type { CountdownTime, TicketRegistration, AdminAccount } from '../types';
import RegistrationModal from './RegistrationModal'; // Re-using for the main raffle
import SlotMachineFrame from './SlotMachineFrame'; // New SVG frame for the slot machine

interface MainRaffleProps {
  targetDate: string | null;
  currentWinningNumber: string | null;
  currentWinnerName: string | null;
  isMainRaffleChecked: boolean;
  onDetermineWinner: (winningNumber: string) => void;
  onAcknowledgeWinner: () => void;
  mainRaffleTicketCost: number;
  quickRaffleCost: number;
  onAddTicketRegistration: (registration: TicketRegistration) => void;
  allAdminAccounts: AdminAccount[];
}

const calculateTimeLeft = (target: Date | null): CountdownTime | null => {
  if (!target) return null;
  const difference = +target - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isPast: false,
  };
};

const SlotMachineReels: React.FC<{ digits: string[]; isSpinning: boolean }> = ({ digits, isSpinning }) => {
  const [displayDigits, setDisplayDigits] = useState(digits);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        // Only main raffle (4 digits) spins with numbers
        if (digits.length === 4) {
            setDisplayDigits(prev => prev.map(() => Math.floor(Math.random() * 10).toString()));
        }
      }, 75);
      return () => clearInterval(interval);
    } else {
      setDisplayDigits(digits);
    }
  }, [isSpinning, digits]);

  const reelWidth = digits.length === 4 ? 'w-12 sm:w-14' : 'w-14 sm:w-16';

  return (
    <div className="flex justify-center gap-2">
      {displayDigits.map((digit, index) => (
        <div 
          key={index}
          className={`${reelWidth} h-20 sm:h-24 bg-black/50 rounded-lg border-2 border-yellow-800 flex items-center justify-center text-4xl sm:text-6xl font-['Orbitron'] text-yellow-400 tabular-nums shadow-inner`}
          aria-live="polite"
        >
          {digit}
        </div>
      ))}
    </div>
  );
};


const QuickRaffle: React.FC<Pick<MainRaffleProps, 'quickRaffleCost' | 'onAddTicketRegistration' | 'allAdminAccounts'>> = ({ quickRaffleCost, onAddTicketRegistration, allAdminAccounts }) => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const robleAdmin = allAdminAccounts.find(a => a.id === 'roble');

    const quickRaffleItemForModal = robleAdmin ? {
        id: 'quick_raffle',
        raffleTitle: 'Sorteo Rápido PUKATU',
        administratorWhatsApp: robleAdmin.whatsAppNumber,
        ticketCost: quickRaffleCost,
        managedByAdminId: robleAdmin.id,
        raffleType: 'quick_raffle' as const,
    } : null;

    return (
        <>
        <div className="my-8 text-center p-6 bg-[#2a1d5e] rounded-lg shadow-lg">
            <h3 className="text-2xl font-['Orbitron'] text-[#f7ca18] mb-2">
                Sorteo Rápido
            </h3>
            
            <div className="relative w-full max-w-sm mx-auto my-4">
                <SlotMachineFrame className="w-full h-auto" />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="mt-2">
                        <SlotMachineReels digits={['P', 'K', 'T']} isSpinning={false} />
                    </div>
                </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              ¡Participa por premios al instante! El resultado se determina al validar tu pago.
            </p>
            {quickRaffleItemForModal && (
              <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="bg-green-500 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 shadow-lg"
              >
                  ¡Participar por ${quickRaffleCost.toFixed(2)}!
              </button>
            )}
        </div>
        {quickRaffleItemForModal && (
            <RegistrationModal
                show={showRegistrationModal}
                onClose={() => setShowRegistrationModal(false)}
                raffleItem={quickRaffleItemForModal}
                onAddTicketRegistration={onAddTicketRegistration}
            />
        )}
        </>
    );
};

const MainRaffle: React.FC<MainRaffleProps> = ({
  targetDate,
  currentWinningNumber,
  currentWinnerName,
  isMainRaffleChecked,
  onDetermineWinner,
  onAcknowledgeWinner,
  mainRaffleTicketCost,
  quickRaffleCost,
  onAddTicketRegistration,
  allAdminAccounts
}) => {
  const target = useMemo(() => (targetDate ? new Date(targetDate) : null), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(calculateTimeLeft(target));
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunThisSession, setHasSpunThisSession] = useState(false);
  const [slotDigits, setSlotDigits] = useState<string[]>(Array(4).fill('-'));

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const robleAdmin = allAdminAccounts.find(a => a.id === 'roble');

  // Set initial state from props
  useEffect(() => {
    if (currentWinningNumber && isMainRaffleChecked) {
      setSlotDigits(currentWinningNumber.padStart(4, '0').split(''));
      setIsSpinning(false);
    } else {
      setSlotDigits(Array(4).fill('-'));
    }
  }, [currentWinningNumber, isMainRaffleChecked]);

  // Handle countdown
  useEffect(() => {
    if (!target) { setTimeLeft(null); return; }
    const updateCountdownState = () => { const newTimeLeft = calculateTimeLeft(target); setTimeLeft(newTimeLeft); return newTimeLeft; };
    const initialTime = updateCountdownState();
    if (initialTime?.isPast) { return; }
    const timer = setInterval(() => { if (updateCountdownState()?.isPast) { clearInterval(timer); } }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  // Handle draw logic
  useEffect(() => {
    if (timeLeft?.isPast && !isMainRaffleChecked && !isSpinning && !hasSpunThisSession) {
      setIsSpinning(true);
      setHasSpunThisSession(true);

      setTimeout(() => {
        const newWinningNumberGen = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setIsSpinning(false);
        onDetermineWinner(newWinningNumberGen);
      }, 4000); // Spin for 4 seconds
    }
  }, [timeLeft, isMainRaffleChecked, hasSpunThisSession, isSpinning, onDetermineWinner]);

  // Update slot digits when winner is determined and not spinning
  useEffect(() => {
    if (!isSpinning && currentWinningNumber) {
        setSlotDigits(currentWinningNumber.padStart(4, '0').split(''));
    }
  }, [isSpinning, currentWinningNumber]);


  // Reset spin session when winner is acknowledged
  useEffect(() => {
    if (!isMainRaffleChecked) {
      setHasSpunThisSession(false);
      setIsSpinning(false);
      setSlotDigits(Array(4).fill('-'));
    }
  }, [isMainRaffleChecked]);

  const TimeSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      <span className="text-4xl sm:text-6xl font-['Orbitron'] text-[#f7ca18] tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  const mainRaffleItemForModal = robleAdmin ? {
    id: 'main_raffle',
    raffleTitle: 'Sorteo Principal PUKATU',
    administratorWhatsApp: robleAdmin.whatsAppNumber,
    ticketCost: mainRaffleTicketCost,
    managedByAdminId: robleAdmin.id,
    raffleType: 'main_draw' as const,
  } : null;

  if (!targetDate && !currentWinningNumber) {
    return <QuickRaffle 
        quickRaffleCost={quickRaffleCost} 
        onAddTicketRegistration={onAddTicketRegistration} 
        allAdminAccounts={allAdminAccounts} 
    />;
  }

  if (isMainRaffleChecked && currentWinningNumber) {
    const baseClasses = "my-8 text-center p-8 bg-gradient-to-br from-yellow-500 via-[#f7ca18] to-yellow-600 rounded-xl shadow-2xl border-2 border-yellow-300 transform transition-all duration-500 ease-out opacity-100 scale-100";
    return (
      <section className={baseClasses} aria-live="assertive">
        <div className="animate-bounce mb-4">
          <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
        </div>
        <h2 className="text-4xl sm:text-5xl font-['Orbitron'] text-black font-bold mb-3">
          {currentWinnerName ? "¡Tenemos Ganador PUKATU!" : "¡Sorteo PUKATU Realizado!"}
        </h2>
        <p className="text-xl text-gray-800 mb-6">El número PUKATU de la suerte es:</p>
        <div className="text-7xl sm:text-8xl font-['Orbitron'] text-black mb-8 p-6 bg-white bg-opacity-30 rounded-lg shadow-inner tracking-widest tabular-nums">
          {currentWinningNumber}
        </div>
        {currentWinnerName ? (
          <p className="text-md text-gray-700 mb-8">
            ¡Felicidades, <span className="font-bold">{currentWinnerName}</span>!
          </p>
        ) : (
          <p className="text-md text-gray-700 mb-8">
            Este número no fue vendido. ¡Sin ganador PUKATU esta vez!
          </p>
        )}
        <button onClick={onAcknowledgeWinner} className="bg-black text-[#f7ca18] font-bold py-3 px-10 rounded-full text-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 shadow-lg">
          Entendido
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="my-8 text-center p-6 bg-gradient-to-br from-[#1e1442] via-[#2a1d5e] to-[#3b2a75] rounded-xl shadow-2xl border border-purple-500/70">
        <h3 className="text-xl sm:text-2xl font-['Montserrat'] font-semibold text-white mb-2 tracking-wide">
          Sorteo PUKATU Principal
        </h3>
        
        <div className="relative w-full max-w-sm mx-auto my-4">
            <SlotMachineFrame className="w-full h-auto" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="mt-2">
                    <SlotMachineReels digits={slotDigits} isSpinning={isSpinning} />
                </div>
            </div>
        </div>

        {timeLeft && !timeLeft.isPast && (
          <div className="mt-4">
            <h4 className="text-lg text-white mb-4">Termina en:</h4>
            <div className="flex justify-center items-start">
              <TimeSegment value={timeLeft.days} label="Días" />
              <span className="text-4xl sm:text-6xl font-['Orbitron'] text-purple-400/70 mx-1 sm:mx-2">:</span>
              <TimeSegment value={timeLeft.hours} label="Horas" />
              <span className="text-4xl sm:text-6xl font-['Orbitron'] text-purple-400/70 mx-1 sm:mx-2">:</span>
              <TimeSegment value={timeLeft.minutes} label="Minutos" />
              <span className="text-4xl sm:text-6xl font-['Orbitron'] text-purple-400/70 mx-1 sm:mx-2">:</span>
              <TimeSegment value={timeLeft.seconds} label="Segundos" />
            </div>
          </div>
        )}

        {timeLeft?.isPast && <p className="text-lg text-gray-300 mt-4 animate-pulse">{isSpinning ? "¡Girando!" : "Determinando resultado..."}</p>}
        
        {!timeLeft?.isPast && mainRaffleItemForModal && (
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <p className="font-bold text-lg text-yellow-300">¡Participa en el Sorteo Principal!</p>
            <p className="text-gray-300 my-2">Costo del ticket: <span className="font-bold text-white">${mainRaffleTicketCost.toFixed(2)}</span></p>
            <button
                onClick={() => setShowRegistrationModal(true)}
                className="bg-[#f7ca18] text-black font-bold py-3 px-10 rounded-full text-lg hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 shadow-lg animate-pulse"
            >
                Comprar Ticket Principal
            </button>
          </div>
        )}
      </section>

      {mainRaffleItemForModal && (
        <RegistrationModal
          show={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          raffleItem={mainRaffleItemForModal}
          onAddTicketRegistration={onAddTicketRegistration}
        />
      )}
    </>
  );
};

export default MainRaffle;