
import React, { useState, useEffect } from 'react';

interface WinnerAnnouncementProps {
  winningNumber: string | null;
  winnerName?: string | null; // Optional: name of the winner
  onAcknowledge: () => void; 
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ winningNumber, winnerName, onAcknowledge }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50); 
    return () => clearTimeout(timer);
  }, []);

  if (!winningNumber) {
    return null;
  }

  const baseClasses = "my-8 text-center p-8 bg-gradient-to-br from-yellow-500 via-[#f7ca18] to-yellow-600 rounded-xl shadow-2xl border-2 border-yellow-300 transform transition-all duration-500 ease-out";
  const animationClasses = isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-95";

  return (
    <section 
      className={`${baseClasses} ${animationClasses}`}
      aria-live="assertive"
    >
      <div className="animate-bounce mb-4">
        <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      </div>
      <h2 className="text-4xl sm:text-5xl font-['Orbitron'] text-black font-bold mb-3">
        {winnerName ? "¡Tenemos un Ganador!" : "¡Sorteo Realizado!"}
      </h2>
      <p className="text-xl text-gray-800 mb-6">El número de la suerte es:</p>
      <div 
        className="text-7xl sm:text-8xl font-['Orbitron'] text-black mb-8 p-6 bg-white bg-opacity-30 rounded-lg shadow-inner tracking-widest tabular-nums"
        aria-live="polite"
      >
        {winningNumber}
      </div>
      
      {winnerName ? (
        <p className="text-md text-gray-700 mb-8">
          ¡Felicidades, <span className="font-bold">{winnerName}</span>! Pronto nos pondremos en contacto (simulación).
        </p>
      ) : (
        <p className="text-md text-gray-700 mb-8">
          Este número no fue vendido. ¡No hubo un ganador con este ticket en esta ocasión!
        </p>
      )}

      <button
        onClick={onAcknowledge}
        className="bg-black text-[#f7ca18] font-bold py-3 px-10 rounded-full text-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 shadow-lg"
      >
        Entendido / Iniciar Nuevo Ciclo
      </button>
    </section>
  );
};

export default WinnerAnnouncement;