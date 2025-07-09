import React from 'react';
import type { Raffle } from '../core/types';
import { NumberStatus } from '../core/types';
import ProgressBar from './ProgressBar';
import MoneyIcon from './icons/MoneyIcon';

interface MillionBagCardProps {
  millionBag: Raffle;
  onSelect: () => void;
}

const MillionBagCard: React.FC<MillionBagCardProps> = ({ millionBag, onSelect }) => {
  const soldCount = millionBag.numbers.filter(n => n.status === NumberStatus.Sold).length;
  const totalCollected = soldCount * 1; // $1 per number
  const prizeAmount = totalCollected * 0.6;

  return (
    <div className="bg-black p-6 rounded-2xl border-2 border-yellow-500/80 relative overflow-hidden million-bag-glow shadow-2xl shadow-black">
        <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="flex items-center space-x-3">
                    <MoneyIcon className="w-8 h-8 text-gold" />
                    <h2 className="text-3xl font-montserrat font-black text-gold uppercase">
                        Bolso Millonario
                    </h2>
                </div>
                <div className="mt-2 sm:mt-0 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/50">
                    ● ACTIVO
                </div>
            </div>

            <div className="text-center my-6">
                <p className="text-lg text-slate-300 font-montserrat">Premio Actual</p>
                <p className="text-5xl md:text-6xl font-montserrat font-black text-gold tracking-tighter">
                    ${prizeAmount.toFixed(2)}
                </p>
            </div>

            <div className="mb-6">
                <ProgressBar current={soldCount} max={1000} />
            </div>

            <button
              onClick={onSelect}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-4 px-4 rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-yellow-500/20 text-lg font-montserrat transform hover:scale-[1.03]"
            >
              ¡Participar Ahora!
            </button>
        </div>
    </div>
  );
};

export default MillionBagCard;