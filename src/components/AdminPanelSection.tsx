import React, { useState, useEffect } from 'react';

interface AdminPanelSectionProps {
  currentRaffleEndDate: string | null;
  onSetRaffleEndDate: (date: string | null) => void;
  currentWinningNumber: string | null; // For display only
  onClearWinner: () => void;
}

const AdminPanelSection: React.FC<AdminPanelSectionProps> = ({
  currentRaffleEndDate,
  onSetRaffleEndDate,
  currentWinningNumber,
  onClearWinner
}) => {
  const [endDateInput, setEndDateInput] = useState('');

  useEffect(() => {
    if (currentRaffleEndDate) {
      const date = new Date(currentRaffleEndDate);
      // Adjust for timezone offset to display local datetime correctly in input
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setEndDateInput(localDateTime);
    } else {
      setEndDateInput('');
    }
  }, [currentRaffleEndDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateInput(e.target.value);
  };

  const handleSetEndDate = () => {
    if (endDateInput) {
      // Convert local datetime input back to ISO string (UTC) for consistent storage
      onSetRaffleEndDate(new Date(endDateInput).toISOString());
    } else {
      onSetRaffleEndDate(null); // This will also trigger clearing winner details in App.tsx
    }
  };

  return (
    <section className="bg-[#2a1d5e] p-6 sm:p-10 rounded-lg shadow-xl text-center my-6 w-full md:max-w-2xl lg:max-w-3xl"> 
      <h3 className="text-3xl font-['Orbitron'] text-white mb-8">Gestión del Sorteo Principal</h3>

      <div className="mb-10 p-6 bg-black bg-opacity-20 rounded-md">
        <h4 className="text-xl font-['Orbitron'] text-[#f7ca18] mb-4">Configurar Fecha Límite del Sorteo Global</h4>
        <p className="text-sm text-gray-400 mb-4">
          Establece la fecha y hora para la finalización automática del sorteo principal.
          Al llegar a esta fecha, se generará un número ganador y se buscará al poseedor del ticket.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="datetime-local"
            value={endDateInput}
            onChange={handleDateChange}
            className="px-4 py-3 bg-[#1a1a1a] text-white border-2 border-[#f7ca18] focus:outline-none focus:border-yellow-300 rounded-md placeholder-gray-500 w-full sm:w-auto text-sm"
          />
          <button
            onClick={handleSetEndDate}
            className="bg-[#f7ca18] text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors w-full sm:w-auto text-sm"
          >
            {currentRaffleEndDate ? 'Actualizar Fecha Límite' : 'Establecer Fecha Límite'}
          </button>
        </div>
        {currentRaffleEndDate && (
            <button
                onClick={() => onSetRaffleEndDate(null)} // This clears date and resets winner cycle in App.tsx
                className="mt-4 text-sm text-red-400 hover:text-red-300 underline"
            >
                Limpiar Fecha y Reiniciar Ciclo
            </button>
        )}
      </div>
      
      {currentWinningNumber ? (
        <div className="mb-8 p-6 bg-black bg-opacity-30 rounded-md">
            <h4 className="text-2xl font-['Orbitron'] text-green-400 mb-3">¡Sorteo Principal Procesado!</h4>
            <p className="text-gray-300 mb-2">Número Ganador Generado:</p>
            <p className="font-bold text-5xl text-green-400 tabular-nums tracking-wider mb-4">{currentWinningNumber}</p>
            <p className="text-sm text-gray-400 mb-6">
                El resultado (ganador o no vendido) se muestra en la página principal.
            </p>
            <button
                onClick={onClearWinner} // Clears winningNumber, winnerName, isMainRaffleChecked
                className="bg-red-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            >
                Liberar para Nuevo Sorteo
            </button>
        </div>
      ) : (
        <div className="p-6 bg-black bg-opacity-20 rounded-md">
          <h4 className="text-xl font-['Orbitron'] text-[#f7ca18] mb-4">Estado del Sorteo Principal</h4>
          {currentRaffleEndDate ? (
            <p className="text-gray-300">
              El sorteo está programado para finalizar y determinar un ganador automáticamente.
              Fecha Límite: {new Date(currentRaffleEndDate).toLocaleString('es-VE', { dateStyle: 'long', timeStyle: 'short' })}.
            </p>
          ) : (
             <p className="text-gray-300">
              Aún no se ha establecido una fecha límite para el sorteo principal.
              Por favor, configure una fecha para activar la cuenta regresiva y el sorteo automático.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminPanelSection;