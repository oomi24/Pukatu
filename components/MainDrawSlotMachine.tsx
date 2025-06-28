
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { CountdownTime, MockUser } from '../types';

interface MainDrawSlotMachineProps {
  targetDate: string | null;
  currentWinningNumber: string | null;
  currentWinnerName: string | null;
  isMainRaffleChecked: boolean;
  onDetermineWinner: (winningNumber: string, winnerName: string | null) => void;
  onAcknowledgeWinner: () => void; // To reset the displayed winner and allow new cycle
  mockUsers: MockUser[];
}

const calculateTimeLeft = (target: Date | null): CountdownTime | null => {
  if (!target) return null;
  const difference = +target - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isPast: false,
  };
};

const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

const MainDrawSlotMachine: React.FC<MainDrawSlotMachineProps> = ({
  targetDate,
  currentWinningNumber,
  currentWinnerName,
  isMainRaffleChecked,
  onDetermineWinner,
  onAcknowledgeWinner,
  mockUsers,
}) => {
  const target = useMemo(() => (targetDate ? new Date(targetDate) : null), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(calculateTimeLeft(target));
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedDigits, setDisplayedDigits] = useState<string[]>(['-', '-', '-', '-']);
  const [hasSpunThisSession, setHasSpunThisSession] = useState(false);

  // Effect for countdown - Simplified dependency
  useEffect(() => {
    if (!target) {
      setTimeLeft(null);
      return;
    }

    // Function to update timeLeft state
    const updateCountdownState = () => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);
      return newTimeLeft;
    };

    const initialTime = updateCountdownState(); // Set immediately on target change

    if (initialTime?.isPast) {
      return; // No interval needed if already past
    }

    const timer = setInterval(() => {
      if (updateCountdownState()?.isPast) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target]); // Depend only on target

  // Effect to initiate and manage the spinning process
  useEffect(() => {
    if (timeLeft?.isPast && !isMainRaffleChecked && !hasSpunThisSession) {
      setIsSpinning(true);
      setHasSpunThisSession(true); 

      let spinCount = 0;
      const spinIntervalId = setInterval(() => {
        setDisplayedDigits([getRandomDigit(), getRandomDigit(), getRandomDigit(), getRandomDigit()]);
        spinCount++;
        if (spinCount >= 30) { 
          clearInterval(spinIntervalId);
          
          const newWinningNumberGen = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          let foundWinnerName: string | null = null;
          
          for (const user of mockUsers) {
            for (const ticketGroup of user.tickets) {
              if (ticketGroup.mainDrawTicketNumbers && ticketGroup.mainDrawTicketNumbers.includes(newWinningNumberGen)) {
                foundWinnerName = user.name;
                break;
              }
            }
            if (foundWinnerName) break;
          }
          onDetermineWinner(newWinningNumberGen, foundWinnerName);
        }
      }, 100);

      return () => {
        clearInterval(spinIntervalId);
      };
    }
  }, [timeLeft, isMainRaffleChecked, hasSpunThisSession, onDetermineWinner, mockUsers]);


  // Effect to react to winner determination or raffle reset
  useEffect(() => {
    if (isMainRaffleChecked && currentWinningNumber) {
      setDisplayedDigits(currentWinningNumber.split(''));
      setIsSpinning(false); 
    } else if (!isMainRaffleChecked) {
      setDisplayedDigits(['-', '-', '-', '-']);
      setIsSpinning(false);
      setHasSpunThisSession(false); 
    }
  }, [isMainRaffleChecked, currentWinningNumber]);


  const DigitDisplay: React.FC<{ digit: string }> = ({ digit }) => (
    <div className="w-12 h-16 sm:w-16 sm:h-20 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center text-3xl sm:text-5xl font-['Orbitron'] text-[#f7ca18] shadow-inner tabular-nums">
      {digit}
    </div>
  );

  const TimeSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      <span className="text-4xl sm:text-6xl font-['Orbitron'] text-[#f7ca18] tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  if (!targetDate && !currentWinningNumber) {
    return (
      <div className="my-8 text-center p-6 bg-[#2a1d5e] rounded-lg shadow-lg">
        <h3 className="text-2xl font-['Orbitron'] text-[#f7ca18] animate-pulse">
          Sorteo PUKATU Principal será anunciado pronto...
        </h3>
      </div>
    );
  }

  if (isMainRaffleChecked && currentWinningNumber) {
    const baseClasses = "my-8 text-center p-8 bg-gradient-to-br from-yellow-500 via-[#f7ca18] to-yellow-600 rounded-xl shadow-2xl border-2 border-yellow-300 transform transition-all duration-500 ease-out opacity-100 scale-100";
    return (
        <section className={baseClasses} aria-live="assertive">
            <div className="animate-bounce mb-4">
            <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-['Orbitron'] text-black font-bold mb-3">
            {currentWinnerName ? "¡Tenemos Ganador PUKATU!" : "¡Sorteo PUKATU Realizado!"}
            </h2>
            <p className="text-xl text-gray-800 mb-6">El número PUKATU de la suerte es:</p>
            <div className="flex justify-center space-x-2 my-6">
                {displayedDigits.map((digit, index) => <DigitDisplay key={index} digit={digit} />)}
            </div>
            {currentWinnerName ? (
            <p className="text-md text-gray-700 mb-8">
                ¡Felicidades, <span className="font-bold">{currentWinnerName}</span>!
            </p>
            ) : (
            <p className="text-md text-gray-700 mb-8">
                Este número no fue vendido. ¡Sin ganador PUKATU esta vez!
            </p>
            )}
            <button
            onClick={onAcknowledgeWinner}
            className="bg-black text-[#f7ca18] font-bold py-3 px-10 rounded-full text-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 shadow-lg"
            >
            Entendido
            </button>
        </section>
    );
  }
  
  if (timeLeft && !timeLeft.isPast) { 
    return (
      <section className="my-8 text-center p-6 bg-gradient-to-br from-[#2a1d5e] to-[#1e1442] rounded-xl shadow-2xl border border-purple-700/50">
        <h3 className="text-xl sm:text-2xl font-['Montserrat'] font-semibold text-white mb-6 tracking-wide">
          Sorteo PUKATU Principal Termina En:
        </h3>
        <div className="flex justify-center items-start">
          <TimeSegment value={timeLeft.days} label="Días" />
          <span className="text-4xl sm:text-6xl font-['Orbitron'] text-purple-400/70 mx-1 sm:mx-2">:</span>
          <TimeSegment value={timeLeft.hours} label="Horas" />
          <span className="text-4xl sm:text-6xl font-['Orbitron'] text-purple-400/70 mx-1 sm:mx-2">:</span>
          <TimeSegment value={timeLeft.minutes} label="Minutos" />
          <span className="text-4xl sm:text-6xl font-['Orbitron'] text-purple-400/70 mx-1 sm:mx-2">:</span>
          <TimeSegment value={timeLeft.seconds} label="Segundos" />
        </div>
        <p className="mt-6 text-sm text-gray-400 animate-pulse">¡Prepárate!</p>
      </section>
    );
  }

  return (
    <section className="my-8 text-center p-6 bg-gradient-to-br from-[#1e1442] via-[#2a1d5e] to-[#3b2a75] rounded-xl shadow-2xl border border-purple-500/70">
      <h3 className="text-2xl sm:text-3xl font-['Orbitron'] text-[#f7ca18] mb-6 animate-pulse">
        {isSpinning ? "¡SORTEANDO NÚMERO PUKATU!" : "¡El Momento PUKATU Ha Llegado!"}
      </h3>
      <div className="flex justify-center space-x-2 my-6" aria-live="polite">
        {displayedDigits.map((digit, index) => <DigitDisplay key={index} digit={digit} />)}
      </div>
      {isSpinning && <p className="text-lg text-gray-300 mt-4">Eligiendo al azar...</p>}
      {!isSpinning && timeLeft?.isPast && !currentWinningNumber && !isMainRaffleChecked &&
        <p className="text-lg text-gray-300 mt-4">Determinando resultado...</p>
      }
    </section>
  );
};

export default MainDrawSlotMachine;
