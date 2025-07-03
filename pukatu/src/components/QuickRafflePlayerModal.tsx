import React, { useState, useEffect, useCallback } from 'react';
import type { TicketRegistration } from '../types';
import SlotMachineFrame from './SlotMachineFrame';
import LeverIcon from './icons/LeverIcon';

interface QuickRafflePlayerModalProps {
  show: boolean;
  onClose: () => void;
  ticket: TicketRegistration;
  onPlayComplete: (updatedTicket: TicketRegistration) => void;
}

const QUICK_RAFFLE_PRIZES = [20, 1, 10, 0, 5, 0, 10, 1, 20, 0, 5, 0];
const PRIZE_REELS: { [key: number]: string[] } = {
  20: ['💎', '💎', '💎'],
  10: ['7️⃣', '7️⃣', '7️⃣'],
  5:  ['🔔', '🔔', '🔔'],
  1:  ['🍒', '🍒', '🍒'],
  0:  ['🍋', '🍉', '🍊']
};
const ALL_SYMBOLS = ['💎', '7️⃣', '🔔', '🍒', '🍋', '🍉', '🍊'];

const QuickRafflePlayerModal: React.FC<QuickRafflePlayerModalProps> = ({ show, onClose, ticket, onPlayComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalPrize, setFinalPrize] = useState<number | null>(null);
  const [reels, setReels] = useState<string[]>(['P', 'K', 'T']);

  useEffect(() => {
    if (!show) {
      setIsSpinning(false);
      setFinalPrize(null);
      setReels(['P', 'K', 'T']);
    }
  }, [show]);

  const handlePlay = useCallback(() => {
    if (isSpinning || finalPrize !== null) return;
    
    setIsSpinning(true);
    const spinInterval = setInterval(() => {
      setReels(prev => prev.map(() => ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)]));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const prize = QUICK_RAFFLE_PRIZES[Math.floor(Math.random() * QUICK_RAFFLE_PRIZES.length)];
      setFinalPrize(prize);
      setReels(PRIZE_REELS[prize] || PRIZE_REELS[0]);
      setIsSpinning(false);
      
      const updatedTicket = {
        ...ticket,
        prizeWon: prize,
        hasBeenPlayed: true,
      };
      onPlayComplete(updatedTicket);
    }, 3000);

  }, [isSpinning, finalPrize, onPlayComplete, ticket]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[120] p-4" onClick={finalPrize === null ? undefined : onClose}>
      <div className="bg-[#1e1442] text-white border-2 border-purple-700/50 rounded-lg shadow-2xl max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
        <div className="relative w-full max-w-sm mx-auto p-4">
          <SlotMachineFrame className="w-full h-auto" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex justify-center gap-2 mt-2">
              {reels.map((symbol, index) => (
                <div key={index} className="w-14 h-24 bg-black/50 rounded-lg border-2 border-yellow-800 flex items-center justify-center text-5xl shadow-inner">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pb-6 px-4">
            {finalPrize === null ? (
                <button 
                    onClick={handlePlay} 
                    disabled={isSpinning}
                    className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform duration-150 active:scale-95 disabled:opacity-70"
                >
                    <LeverIcon className="w-8 h-8"/>
                    {isSpinning ? '¡GIRANDO!' : 'JALAR PALANCA'}
                </button>
            ) : (
                <div className="text-center p-4 bg-black/30 rounded-lg animate-fade-in">
                    <h3 className="text-3xl font-bold font-['Orbitron'] text-yellow-400">
                        {finalPrize > 0 ? `¡GANASTE $${finalPrize.toFixed(2)}!` : '¡Mejor Suerte la Próxima Vez!'}
                    </h3>
                    <button onClick={onClose} className="mt-4 bg-[#f7ca18] text-black font-semibold py-2 px-6 rounded-md">
                        Cerrar
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuickRafflePlayerModal;
