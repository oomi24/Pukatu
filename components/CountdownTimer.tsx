
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  onComplete: () => void;
  isComplete: boolean;
}

interface TimeLeft {
  [key: string]: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete, isComplete }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    if (isComplete) return;

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    if (value < 0) return null;
    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-poppins font-bold text-fuchsia-400 neon-highlight">{String(value).padStart(2, '0')}</span>
        <span className="text-xs text-slate-400 uppercase">{interval}</span>
      </div>
    );
  });

  if (isComplete) {
    return (
      <div className="text-center py-4">
        <h3 className="text-2xl font-poppins font-bold text-fuchsia-400 neon-highlight">
          Sorteo Finalizado
        </h3>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4 md:space-x-8">
      {timerComponents.length ? timerComponents : <span className="text-xl">Cargando...</span>}
    </div>
  );
};

export default CountdownTimer;
