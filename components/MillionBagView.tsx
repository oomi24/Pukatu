
import React, { useState, useEffect } from 'react';
import type { MillionBagState, MillionBagNumber, Buyer } from '../types';
import { NumberStatus } from '../types';
import CountdownTimer from './CountdownTimer';
import SlotMachine from './SlotMachine';
import PurchaseModal from './PurchaseModal';
import PrizeCalculator from './PrizeCalculator';
import ProgressBar from './ProgressBar';

interface MillionBagViewProps {
  millionBag: MillionBagState;
  onUpdateMillionBag: (updatedBag: MillionBagState) => void;
  onBack: () => void;
}

const NumberButton: React.FC<{ num: MillionBagNumber; onClick: () => void; }> = ({ num, onClick }) => {
  const getButtonClass = () => {
    switch (num.status) {
      case NumberStatus.Sold:
        return 'bg-red-900/50 border-red-500/30 text-red-400/50 cursor-not-allowed';
      case NumberStatus.Pending:
        return 'bg-yellow-900/50 border-yellow-500/30 text-yellow-400/50 cursor-not-allowed animate-pulse';
      case NumberStatus.Available:
      default:
        return 'bg-gray-700/50 border-gray-600/50 hover:bg-yellow-500 hover:text-black hover:border-yellow-400 transition-all duration-200 transform hover:scale-110';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={num.status !== NumberStatus.Available}
      className={`w-full h-9 rounded-md font-mono text-xs flex items-center justify-center border ${getButtonClass()}`}
    >
      {num.number}
    </button>
  );
};

const MillionBagView: React.FC<MillionBagViewProps> = ({ millionBag, onUpdateMillionBag, onBack }) => {
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showWinnerInfo, setShowWinnerInfo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const soldCount = millionBag.numbers.filter(n => n.status === NumberStatus.Sold || n.status === NumberStatus.Pending).length;
  const totalCollected = soldCount * 1; // $1 per number
  
  const triggerDraw = () => {
     if (millionBag.winningNumber === null) {
      const winner = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      const updatedBag = { ...millionBag, winningNumber: winner };
      onUpdateMillionBag(updatedBag);
      setIsDrawTime(true);
      setShowSlotMachine(true);
    }
  };
  
  useEffect(() => {
    if (millionBag.winningNumber) {
        setIsDrawTime(true);
        setShowSlotMachine(false);
        setShowWinnerInfo(true);
        return;
    }

    const checkConditions = () => {
        const dateConditionMet = (millionBag.config.mode === 'date' || millionBag.config.mode === 'hybrid') && new Date(millionBag.closeDate) < new Date();
        const salesConditionMet = (millionBag.config.mode === 'sales' || millionBag.config.mode === 'hybrid') && soldCount >= 1000;

        if (dateConditionMet || salesConditionMet) {
            triggerDraw();
        }
    };
    checkConditions();
  }, [soldCount, millionBag.config, millionBag.winningNumber, millionBag.closeDate]);
  

  const handleAnimationEnd = () => {
    setShowSlotMachine(false);
    setShowWinnerInfo(true);
  };
  
  const handleNumberClick = (num: MillionBagNumber) => {
    if (num.status === NumberStatus.Available) {
      setSelectedNumber(num.number);
      setModalOpen(true);
    }
  };

  const handlePurchase = (buyer: Buyer) => {
    if (selectedNumber === null) return;
    const updatedNumbers = millionBag.numbers.map(n => 
      n.number === selectedNumber ? { ...n, status: NumberStatus.Pending, buyer } : n
    );
    onUpdateMillionBag({ ...millionBag, numbers: updatedNumbers });
    setModalOpen(false);
    setSelectedNumber(null);
  };

  const winnerInfo = millionBag.numbers.find(n => n.number === millionBag.winningNumber);
  const winnerText = winnerInfo && winnerInfo.status !== NumberStatus.Available 
    ? `Ganador: ${winnerInfo.buyer?.name} (${winnerInfo.buyer?.phone}) con el número ${millionBag.winningNumber}`
    : `No hubo ganador. El número ${millionBag.winningNumber} no fue vendido.`;

  if (showSlotMachine && millionBag.winningNumber !== null) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <SlotMachine winningNumber={millionBag.winningNumber} onAnimationEnd={handleAnimationEnd} />
        </div>
      );
  }

  const getTriggerText = () => {
    const date = new Date(millionBag.closeDate).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric'});
    switch(millionBag.config.mode) {
      case 'date': return `Sorteo programado para el ${date}`;
      case 'sales': return 'Sorteo al venderse todos los números';
      case 'hybrid':
      default:
        return `Sorteo: ${date} o al completar la venta`;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={onBack} className="mb-6 text-yellow-400 hover:text-yellow-300 font-bold">&larr; Volver al Inicio</button>
        
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black font-montserrat text-gold uppercase tracking-wider">Bolso Millonario</h1>
            <p className="text-slate-400 mt-2">{getTriggerText()}</p>
        </div>

        <PrizeCalculator totalCollected={totalCollected} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 {(millionBag.config.mode === 'date' || millionBag.config.mode === 'hybrid') && (
                     <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-poppins font-bold mb-3 text-center text-yellow-400">Cierre del Sorteo</h3>
                        <CountdownTimer targetDate={millionBag.closeDate} onComplete={triggerDraw} isComplete={isDrawTime} />
                     </div>
                 )}
                 <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-poppins font-bold mb-3">Progreso de Venta</h3>
                    <ProgressBar current={soldCount} max={1000} />
                </div>
            </div>

            <div className="lg:col-span-2 bg-gray-900/70 border border-gray-800 rounded-xl p-6">
            {showWinnerInfo && millionBag.winningNumber !== null ? (
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-poppins font-bold mb-4">Resultados del Bolso</h2>
                    <p className="text-5xl font-poppins font-bold text-gold neon-highlight mb-4">{millionBag.winningNumber}</p>
                    <p className="text-lg text-slate-300">{winnerText}</p>
                    {winnerInfo && winnerInfo.status !== NumberStatus.Available && winnerInfo.buyer && (
                        <a href={`https://wa.me/${winnerInfo.buyer.phone}?text=¡Felicidades!%20Ganaste%20el%20sorteo%20del%20Bolso%20Millonario%20de%20Pukatu%20con%20el%20número%20${millionBag.winningNumber}.`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-green-500 text-white font-bold py-2 px-4 rounded">
                        Notificar por WhatsApp
                        </a>
                    )}
                </div>
            ) : (
                <>
                <h3 className="text-xl font-poppins font-bold mb-4">Selecciona tus números ($1.00 c/u)</h3>
                <div className="grid grid-cols-10 md:grid-cols-20 lg:grid-cols-25 gap-1.5">
                    {millionBag.numbers.map(num => (
                        <NumberButton key={num.number} num={num} onClick={() => handleNumberClick(num)} />
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
            isMillionBag={true}
            />
        )}
        </div>
    </div>
  );
};

export default MillionBagView;