
import React, { useState, useMemo, useEffect } from 'react';

interface LargeGridSelectorProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (selectedNumbers: number[]) => void;
  raffleTitle: string;
  gridNumbersTotal: number;
  gridStartNumber: number;
  soldNumbers: number[];
  pendingReservedNumbers: number[];
}

const LargeGridSelector: React.FC<LargeGridSelectorProps> = ({
  show,
  onClose,
  onConfirm,
  raffleTitle,
  gridNumbersTotal,
  gridStartNumber,
  soldNumbers,
  pendingReservedNumbers,
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const allNumbers = useMemo(() => {
    return Array.from({ length: gridNumbersTotal }, (_, i) => i + gridStartNumber);
  }, [gridNumbersTotal, gridStartNumber]);

  const filteredNumbers = useMemo(() => {
    if (!searchTerm.trim()) {
      return allNumbers;
    }
    return allNumbers.filter(num => num.toString().includes(searchTerm.trim()));
  }, [allNumbers, searchTerm]);

  useEffect(() => {
    if (!show) {
      setSelectedNumbers([]);
      setSearchTerm('');
    }
  }, [show]);

  const handleNumberClick = (num: number) => {
    if (soldNumbers.includes(num) || pendingReservedNumbers.includes(num)) {
      return;
    }
    setSelectedNumbers(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedNumbers);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[110] p-2 sm:p-4" onClick={onClose}>
      <div className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-2xl w-full h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-purple-600/30">
          <h5 className="text-base sm:text-lg font-semibold font-['Orbitron'] text-[#f7ca18]">
            Seleccionar Números para: <span className="text-white">{raffleTitle}</span>
          </h5>
          <p className="text-xs text-gray-400 mt-1">
            Busca y haz clic en los números que deseas comprar. Los números en verde están vendidos/reservados.
          </p>
        </div>
        
        <div className="p-3 sm:p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Buscar número entre ${gridStartNumber} y ${gridStartNumber + gridNumbersTotal - 1}...`}
            className="w-full px-3 py-2 bg-[#1a1a1a] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7ca18]"
          />
        </div>

        <div className="flex-grow overflow-y-auto px-3 sm:px-4 py-2">
          {filteredNumbers.length > 0 ? (
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {filteredNumbers.map(num => {
                const isSold = soldNumbers.includes(num);
                const isPending = pendingReservedNumbers.includes(num);
                const isEffectivelySold = isSold || isPending;
                const isSelected = selectedNumbers.includes(num);
                const numPadding = (gridStartNumber + gridNumbersTotal - 1).toString().length;

                return (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={isEffectivelySold}
                    className={`
                      aspect-square flex items-center justify-center text-xs font-semibold border rounded-md transition-colors
                      ${isEffectivelySold ? 'bg-green-800 text-gray-400 cursor-not-allowed border-green-700' :
                       isSelected ? 'bg-yellow-400 text-black ring-2 ring-yellow-500 border-yellow-400' :
                       'bg-gray-700 text-white hover:bg-gray-600 border-gray-500'
                      }
                    `}
                    aria-label={isEffectivelySold ? `Número ${num} (Vendido)` : `Seleccionar número ${num}`}
                  >
                    {num.toString().padStart(numPadding, '0')}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No se encontraron números con "{searchTerm}".</p>
          )}
        </div>

        <div className="p-4 border-t border-purple-600/30 mt-auto bg-[#1e1442]/90 backdrop-blur-sm">
          <div className="flex justify-between items-center">
             <button type="button" onClick={onClose} className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-500 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedNumbers.length === 0}
              className="bg-[#f7ca18] text-black font-bold py-2 px-5 rounded-md hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Selección ({selectedNumbers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeGridSelector;
