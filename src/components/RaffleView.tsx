import React, { useState, useEffect } from 'react';
import type { Raffle, RaffleNumber, Buyer } from '../core/types';
import { NumberStatus } from '../core/types';
import CountdownTimer from './CountdownTimer';
import SlotMachine from './SlotMachine';
import PurchaseModal from './PurchaseModal';

interface RaffleViewProps {
  raffle: Raffle;
  onUpdateRaffle: (updatedRaffle: Raffle) => void;
  onBack: () => void;
}

const NumberButton: React.FC<{ num: RaffleNumber; onClick: () => void; raffleSize: number; }> = ({ num, onClick, raffleSize }) => {
  const getButtonClass = () => {
    switch (num.status) {
      case NumberStatus.Sold:
        return 'bg-red-500 cursor-not-allowed text-red-200';
      case NumberStatus.Pending:
        return 'bg-yellow-500 cursor-not-allowed text-yellow-100';
      case NumberStatus.Available:
      default:
        return 'bg-slate-700 hover:bg-cyan-500 hover:text-white transition-colors';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={num.status !== NumberStatus.Available}
      className={`w-full h-10 rounded font-mono text-sm flex items-center justify-center ${getButtonClass()}`}
    >
      {String(num.number).padStart(String(raffleSize).length -1, '0')}
    </button>
  );
};

const RaffleView: React.FC<RaffleViewProps> = ({ raffle, onUpdateRaffle, onBack }) => {
  const [isDrawTime, setIsDrawTime] = useState(new Date(raffle.closeDate) < new Date());
  const [showSlotMachine, setShowSlotMachine] = useState(isDrawTime && !raffle.winningNumber);
  const [showWinnerInfo, setShowWinnerInfo] = useState(isDrawTime && !!raffle.winningNumber);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const handleTimeUp = () => {
    if (raffle.winningNumber === null || raffle.winningNumber === undefined) {
      const winner = Math.floor(Math.random() * raffle.size);
      const updatedRaffle = { ...raffle, winningNumber: winner };
      onUpdateRaffle(updatedRaffle);
      setIsDrawTime(true);
      setShowSlotMachine(true);
    }
  };

  const handleAnimationEnd = () => {
    setShowSlotMachine(false);
    setShowWinnerInfo(true);
  };
  
  const handleNumberClick = (num: RaffleNumber) => {
    if (num.status === NumberStatus.Available) {
      setSelectedNumber(num.number);
      setModalOpen(true);
    }
  };

  const handlePurchase = (buyer: Buyer) => {
    if (selectedNumber === null) return;
    const updatedNumbers = raffle.numbers.map(n => 
      (n as RaffleNumber).number === selectedNumber ? { ...n, status: NumberStatus.Pending, buyer } : n
    );
    onUpdateRaffle({ ...raffle, numbers: updatedNumbers });
    setModalOpen(false);
    setSelectedNumber(null);
  };

  if (raffle.isMillionBag) {
      return <div className="p-4 text-red-500">Error: Vista incorrecta para este tipo de sorteo.</div>
  }
  
  const numbers = raffle.numbers as RaffleNumber[];
  const winnerInfo = numbers.find(n => n.number === raffle.winningNumber);
  const winnerText = winnerInfo && winnerInfo.status !== NumberStatus.Available 
    ? `Ganador: ${winnerInfo.buyer?.name} (${winnerInfo.buyer?.phone}) con el número ${String(raffle.winningNumber).padStart(String(raffle.size).length -1, '0')}`
    : `No hubo ganador. El número ${String(raffle.winningNumber).padStart(String(raffle.size).length -1, '0')} no fue vendido.`;

  if (showSlotMachine && raffle.winningNumber !== null) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <SlotMachine winningNumber={raffle.winningNumber} onAnimationEnd={handleAnimationEnd} />
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="mb-6 text-cyan-400 hover:text-cyan-300">&larr; Volver a Sorteos</button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glassmorphism rounded-xl p-6">
            <img src={raffle.prizeImage} alt="Prize" className="w-full rounded-lg mb-4" />
            <h2 className="text-2xl font-poppins font-bold text-white mb-2">{raffle.description}</h2>
            <div className="border-t border-slate-700 pt-4 mt-4">
              <CountdownTimer targetDate={raffle.closeDate} onComplete={handleTimeUp} isComplete={isDrawTime} />
            </div>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-poppins font-bold mb-3">Términos y Condiciones</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{raffle.terms}</p>
          </div>
        </div>

        <div className="lg:col-span-2 glassmorphism rounded-xl p-6">
          {showWinnerInfo && raffle.winningNumber !== null ? (
            <div className="text-center flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-poppins font-bold mb-4">Resultados del Sorteo</h2>
              <p className="text-4xl font-poppins font-bold text-fuchsia-400 neon-highlight mb-4">{String(raffle.winningNumber).padStart(String(raffle.size).length -1, '0')}</p>
              <p className="text-lg text-slate-300">{winnerText}</p>
               {winnerInfo && winnerInfo.status !== NumberStatus.Available && winnerInfo.buyer && (
                 <a href={`https://wa.me/${winnerInfo.buyer.phone}?text=¡Felicidades!%20Ganaste%20el%20sorteo%20de%20Pukatu%20con%20el%20número%20${String(raffle.winningNumber).padStart(String(raffle.size).length -1,'0')}.`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-green-500 text-white font-bold py-2 px-4 rounded">
                  Notificar por WhatsApp
                 </a>
               )}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-poppins font-bold mb-4">Selecciona tus números</h3>
              <div className="grid grid-cols-10 gap-2">
                {numbers.map(num => (
                  <NumberButton key={num.number} num={num} onClick={() => handleNumberClick(num)} raffleSize={raffle.size} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {modalOpen && selectedNumber !== null && (
        <PurchaseModal 
          numberToBuy={selectedNumber}
          onClose={() => setModalOpen(false)}
          onConfirm={handlePurchase}
          isMillionBag={false}
        />
      )}
    </div>
  );
};

export default RaffleView;