import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max }) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-sm text-slate-300 mb-1 font-montserrat">
        <span>{current.toLocaleString()} / {max.toLocaleString()} Vendidos</span>
        <span className="font-bold">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-4 border border-gray-600">
        <div
          className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;