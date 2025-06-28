import React, { useState, useEffect, useMemo } from 'react';
import type { CountdownTime } from '../types';

interface CountdownDisplayProps {
  targetDate: string | null;
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

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ targetDate }) => {
  const target = useMemo(() => targetDate ? new Date(targetDate) : null, [targetDate]);
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(calculateTimeLeft(target));

  useEffect(() => {
    if (!target || timeLeft?.isPast) {
      setTimeLeft(calculateTimeLeft(target)); // Recalculate if target changes or to confirm past state
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target, timeLeft?.isPast]);

  if (!targetDate || !timeLeft) {
    return (
      <div className="my-8 text-center p-6 bg-[#2a1d5e] rounded-lg shadow-lg">
        <h3 className="text-2xl font-['Orbitron'] text-[#f7ca18] animate-pulse">
          Próximo sorteo será anunciado pronto...
        </h3>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="my-8 text-center p-6 bg-[#2a1d5e] rounded-lg shadow-lg">
        <h3 className="text-3xl font-['Orbitron'] text-red-500">
          ¡El Sorteo Ha Finalizado!
        </h3>
        <p className="text-gray-300 mt-2">Esperamos que hayas participado. ¡Mucha suerte!</p>
      </div>
    );
  }

  const TimeSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      <span className="text-4xl sm:text-6xl font-['Orbitron'] text-[#f7ca18] tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <section className="my-8 text-center p-6 bg-gradient-to-br from-[#2a1d5e] to-[#1e1442] rounded-xl shadow-2xl border border-purple-700/50">
      <h3 className="text-xl sm:text-2xl font-['Montserrat'] font-semibold text-white mb-6 tracking-wide">
        El Sorteo Termina En:
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
       <p className="mt-6 text-sm text-gray-400 animate-pulse">¡No te lo pierdas!</p>
    </section>
  );
};

export default CountdownDisplay;