import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { RaffleItem, TicketRegistration, CountdownTime } from '../types';
import RegistrationModal from './RegistrationModal';

const calculateCardCountdown = (targetDateStr: string | undefined): CountdownTime | null => {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr);
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

const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

interface ClashCardProps {
  item: RaffleItem;
  ticketRegistrations: TicketRegistration[]; // Added prop
  onNavigateToVerifyTicketScreen?: () => void;
  onAddTicketRegistration: (registration: TicketRegistration) => void;
  onGridCardDrawCompleted: (raffleId: string, winningNumber: string) => void;
}

const ClashCard: React.FC<ClashCardProps> = ({ 
    item, 
    ticketRegistrations, // Destructure new prop
    onNavigateToVerifyTicketScreen, 
    onAddTicketRegistration, 
    onGridCardDrawCompleted 
}) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedGridNumbers, setSelectedGridNumbers] = useState<number[]>([]);
  
  const [cardTimeLeft, setCardTimeLeft] = useState<CountdownTime | null>(calculateCardCountdown(item.targetDate));
  const [isCardSpinning, setIsCardSpinning] = useState(false);
  const [cardSlotDigits, setCardSlotDigits] = useState<string[]>(['-', '-', '-']);
  const [isThisGridDrawProcessed, setIsThisGridDrawProcessed] = useState(item.isGridCardDrawComplete || false);

  const pendingReservedNumbersForThisCard = useMemo(() => {
    return ticketRegistrations
      .filter(reg => reg.raffleId === item.id && reg.paymentStatus === 'Pendiente')
      .flatMap(reg => reg.ticketNumber.split(',').map(nStr => parseInt(nStr.trim(), 10)).filter(n => !isNaN(n)));
  }, [ticketRegistrations, item.id]);

  useEffect(() => {
    setSelectedGridNumbers([]);
    setIsThisGridDrawProcessed(item.isGridCardDrawComplete || false);
    if (item.isGridCardDrawComplete && item.gridCardWinningNumber) {
      setCardSlotDigits(item.gridCardWinningNumber.padStart(3, '0').split(''));
    } else {
      setCardSlotDigits(['-', '-', '-']);
    }
  }, [item.id, item.isGridCardDrawComplete, item.gridCardWinningNumber]);
  
  useEffect(() => {
    if (!item.targetDate || isThisGridDrawProcessed) {
      setCardTimeLeft(calculateCardCountdown(isThisGridDrawProcessed ? undefined : item.targetDate));
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateCardCountdown(item.targetDate);
      setCardTimeLeft(newTimeLeft);
      if (newTimeLeft?.isPast) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [item.targetDate, isThisGridDrawProcessed]);

  useEffect(() => {
    if (cardTimeLeft?.isPast && !isThisGridDrawProcessed && !isCardSpinning) {
      setIsCardSpinning(true);
      let spinCount = 0;
      const spinInterval = setInterval(() => {
        setCardSlotDigits([getRandomDigit(), getRandomDigit(), getRandomDigit()]);
        spinCount++;
        if (spinCount >= 20) { 
          clearInterval(spinInterval);
          const randomNumber = Math.floor(Math.random() * item.gridNumbersTotal) + 1;
          const winningGridNumberStr = randomNumber.toString();
          
          setCardSlotDigits(winningGridNumberStr.padStart(3, '0').split(''));
          setIsCardSpinning(false);
          setIsThisGridDrawProcessed(true);
          onGridCardDrawCompleted(item.id, winningGridNumberStr);
        }
      }, 100);
      return () => clearInterval(spinInterval);
    }
  }, [cardTimeLeft, isThisGridDrawProcessed, isCardSpinning, item.id, item.gridNumbersTotal, onGridCardDrawCompleted]);


  const handleOpenRegistrationModal = () => setShowRegistrationModal(true);
  const handleCloseRegistrationModal = () => setShowRegistrationModal(false);

  const handleGridNumberClick = (number: number) => {
    const isSoldByAdmin = item.soldNumbers?.includes(number);
    const isPendingByUser = pendingReservedNumbersForThisCard.includes(number);
    const isEffectivelySold = isSoldByAdmin || isPendingByUser;

    if (isEffectivelySold || isThisGridDrawProcessed) return; 

    setSelectedGridNumbers(prevSelected =>
      prevSelected.includes(number)
        ? prevSelected.filter(n => n !== number)
        : [...prevSelected, number]
    );
  };
  
  const CardCountdownDisplay: React.FC<{ timeLeft: CountdownTime | null; small?: boolean }> = ({ timeLeft, small = false }) => {
    if (!timeLeft || timeLeft.isPast) return null;

    const numSize = small ? "text-sm" : "text-lg";
    const labelSize = small ? "text-[7px]" : "text-[8px]";
    const colonSize = small ? "text-sm" : "text-lg";

    return (
      <div className={`flex justify-center items-center ${small ? 'gap-0.5 my-0.5' : 'gap-1 my-1'} font-['Orbitron']`}>
        {[
          { value: timeLeft.days, label: 'D' },
          { value: timeLeft.hours, label: 'H' },
          { value: timeLeft.minutes, label: 'M' },
          { value: timeLeft.seconds, label: 'S' },
        ].map((seg, idx) => (
          <React.Fragment key={seg.label}>
            <div className="flex flex-col items-center">
              <span className={`${numSize} tabular-nums text-cyan-500`}>{String(seg.value).padStart(2, '0')}</span>
              <span className={`${labelSize} text-neutral-600`}>{seg.label}</span>
            </div>
            {idx < 3 && <span className={`${colonSize} text-cyan-600 mx-px`}>:</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const CardSlotDisplay: React.FC<{ digits: string[]; isSpinning: boolean; title?: string }> = ({ digits, isSpinning, title }) => (
    <div className="text-center my-1 p-1 bg-black/30 rounded">
      {title && <p className="text-[9px] text-yellow-500 font-semibold mb-0.5">{title}</p>}
      <div className={`flex justify-center gap-1 ${isSpinning ? 'animate-pulse' : ''}`}>
        {digits.map((digit, index) => (
          <div key={index} className="w-5 h-7 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-sm font-['Orbitron'] text-yellow-400 tabular-nums">
            {digit}
          </div>
        ))}
      </div>
    </div>
  );


  const renderGridCard = () => {
    const numCols = 10;
    const totalGridNumbers = item.gridNumbersTotal;
    const numbersArray = Array.from({ length: totalGridNumbers }, (_, i) => i + 1);

    const showSlotMachine = isCardSpinning || isThisGridDrawProcessed;
    const showCountdown = cardTimeLeft && !cardTimeLeft.isPast && !isThisGridDrawProcessed;

    return (
      <div className="bg-[#f0e6d2] border-4 border-red-600 rounded-lg shadow-2xl w-full flex flex-col font-sans relative overflow-hidden">
        <div className="relative w-full">
          <img 
            src={item.imageUrl || 'https://picsum.photos/seed/grid_default/300/100'} 
            alt={item.raffleTitle} 
            className="w-full h-12 object-cover"
          />
          {item.ticketCost !== undefined && (
            <div className="absolute top-0 left-0 bg-red-600 text-white p-0.5 transform -rotate-3 -translate-x-px -translate-y-px shadow-md">
              <span className="font-bold text-xs">${item.ticketCost.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          )}
          {item.prizeDetails && item.prizeDetails.length > 0 && (
             <div className="absolute top-px right-px bg-red-700 text-white text-[8px] font-bold px-1 py-px rounded-full shadow-lg border-px border-white">
                {item.prizeDetails.length} PREMIOS
            </div>
          )}
        </div>

        <div className="py-0.5 px-1 flex flex-col"> 
          {item.callToAction && <p className="text-center text-red-600 font-bold text-[9px] italic mb-px">{item.callToAction}</p>}
          <h3 className="text-center text-black font-extrabold text-sm my-px leading-tight">{item.raffleTitle}</h3>
          {item.raffleSubtitle && <p className="text-center text-[7px] text-gray-700 mb-px">{item.raffleSubtitle}</p>}

          {item.prizeDetails && item.prizeDetails.length > 0 && (
            <div className="text-left text-gray-800 my-px px-0.5 space-y-px"> 
              {item.prizeDetails.map((detail, index) => (
                <p key={index} className="leading-tight text-[7px]"><strong className="font-semibold">{detail.split(':')[0]}:</strong>{detail.split(':')[1]}</p> 
              ))}
            </div>
          )}
          
          <div className={`grid grid-cols-${numCols} gap-px my-px bg-red-600 p-px rounded`}> 
            {numbersArray.map((num) => {
              const isSoldByAdmin = item.soldNumbers?.includes(num);
              const isPendingByUser = pendingReservedNumbersForThisCard.includes(num);
              const isEffectivelySold = isSoldByAdmin || isPendingByUser;
              
              const isSelected = selectedGridNumbers.includes(num);
              const isWinningNumber = isThisGridDrawProcessed && item.gridCardWinningNumber === num.toString();

              return (
                <button
                  key={num}
                  onClick={() => handleGridNumberClick(num)}
                  disabled={isEffectivelySold || isThisGridDrawProcessed}
                  className={`
                    aspect-square flex items-center justify-center text-[9px] font-semibold border-px border-red-300 
                    ${isEffectivelySold ? 'bg-green-600 text-white cursor-not-allowed' : 
                     isSelected ? 'bg-yellow-400 text-black ring-1 ring-yellow-600' : 
                     isThisGridDrawProcessed ? 
                        (isWinningNumber ? 'bg-yellow-500 text-black animate-pulse ring-2 ring-yellow-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60') :
                     'bg-white text-black hover:bg-yellow-200'}
                  `} 
                  aria-label={isEffectivelySold ? `Número ${num} (Vendido/Reservado)` : `Número ${num}`}
                >
                  {num.toString().padStart(totalGridNumbers >= 100 ? 3 : totalGridNumbers >=10 ? 2 : 1, '0')}
                </button>
              );
            })}
          </div>
          
          {showSlotMachine && (
            <CardSlotDisplay digits={cardSlotDigits} isSpinning={isCardSpinning} title={isThisGridDrawProcessed ? "Número Ganador Sorteo:" : "Sorteando..."}/>
          )}
          {showCountdown && (
            <div className="my-0.5">
               <p className="text-[8px] text-center text-gray-600 font-semibold">Este Sorteo Termina En:</p>
               <CardCountdownDisplay timeLeft={cardTimeLeft} small={true}/>
            </div>
          )}
           {!showCountdown && !showSlotMachine && item.targetDate && (
             <p className="text-[8px] text-center text-red-500 font-semibold my-1">Sorteo finalizado, procesando...</p>
           )}

          <div className="flex flex-col items-stretch pt-px w-full gap-px"> 
            <button
                onClick={handleOpenRegistrationModal}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-0.5 px-2 rounded text-[8px] w-full" 
                title="Comprar tickets seleccionados"
                disabled={selectedGridNumbers.length === 0 || isThisGridDrawProcessed || isCardSpinning}
            >
                Comprar {selectedGridNumbers.length > 0 ? `(${selectedGridNumbers.length})` : ''}
            </button>
            {item.date && (
                <p className="text-center text-[7px] font-bold text-white bg-red-700 py-0.5 rounded-b-sm w-full -mx-px -mb-px border-t border-red-800">{item.date}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {renderGridCard()}
      {showRegistrationModal && item && (
        <RegistrationModal
          show={showRegistrationModal}
          onClose={handleCloseRegistrationModal}
          raffleItem={{ 
            id: item.id,
            raffleTitle: item.raffleTitle,
            administratorWhatsApp: item.administratorWhatsApp,
            ticketCost: item.ticketCost,
            managedByAdminId: item.managedByAdminId,
            raffleType: 'grid',
            selectedGridNumbers: selectedGridNumbers, 
          }}
          onAddTicketRegistration={onAddTicketRegistration}
        />
      )}
    </>
  );
};

export default ClashCard;