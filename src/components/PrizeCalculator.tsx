import React from 'react';

interface PrizeCalculatorProps {
  totalCollected: number;
}

const PrizeCalculator: React.FC<PrizeCalculatorProps> = ({ totalCollected }) => {
  const prizeAmount = totalCollected * 0.6;

  return (
    <div className="bg-black/50 p-4 md:p-6 rounded-xl mb-6 border border-gray-800">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center p-2">
          <h3 className="text-gray-400 text-sm sm:text-base uppercase font-semibold tracking-wider mb-1">Premio a Repartir</h3>
          <p className="text-3xl sm:text-4xl font-bold text-gold font-montserrat">${prizeAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PrizeCalculator;