import React from 'react';
import type { Raffle } from '../core/types';
import CountdownTimer from './CountdownTimer';

interface RaffleCardProps {
  raffle: Raffle;
  onSelect: () => void;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onSelect }) => {
  const soldCount = raffle.numbers.filter(n => n.status === 'Sold').length;
  const progress = (soldCount / raffle.size) * 100;
  const isFinished = new Date(raffle.closeDate) < new Date() || raffle.winningNumber != null;

  return (
    <div className="glassmorphism rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-transform duration-300 hover:scale-[1.02] hover:shadow-cyan-500/20">
      <img className="w-full h-48 object-cover" src={raffle.prizeImage} alt="Prize" />
      <div className="p-6">
        <h3 className="font-poppins text-xl font-bold mb-2 text-white">{raffle.description}</h3>
        <div className="mb-4">
            <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                <span>Progreso</span>
                <span>{soldCount} / {raffle.size} vendidos</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-cyan-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        <div className="mb-6">
            <CountdownTimer targetDate={raffle.closeDate} onComplete={() => {}} isComplete={isFinished} />
        </div>
        <button
          onClick={onSelect}
          className="w-full bg-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-fuchsia-600 transition-colors duration-300 shadow-lg shadow-fuchsia-500/20"
        >
          {isFinished ? 'Ver Resultados' : 'Participar'}
        </button>
      </div>
    </div>
  );
};

export default RaffleCard;