import React, { useState, useEffect } from 'react';

interface SlotMachineProps {
  winningNumber: number | string;
  onAnimationEnd: () => void;
}

const Reel: React.FC<{ finalDigit: number; delay: number }> = ({ finalDigit, delay }) => {
  const [position, setPosition] = useState(-9 * 48); // Start at '0' but from a high position for animation
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpinning(false);
      // The final position centers the winning digit.
      // Each digit has a height of 3rem (48px). The reel container is also 3rem high.
      // translateY(0) shows '0', translateY(-48px) shows '1', etc.
      setPosition(-finalDigit * 48);
    }, delay);

    return () => clearTimeout(timer);
  }, [finalDigit, delay]);

  const transitionDuration = delay / 1000;
  
  return (
    <div className="relative w-16 h-12 overflow-hidden bg-slate-900/50 border-2 border-fuchsia-500 rounded-lg neon-border-highlight">
      <div
        className="absolute w-full flex flex-col items-center justify-start text-3xl font-bold"
        style={{
          transform: `translateY(${position}px)`,
          transition: `transform ${spinning ? transitionDuration : 1}s cubic-bezier(0.25, 1, 0.5, 1)`,
        }}
      >
        {/* Repeat numbers for a seamless spin illusion */}
        {[...Array(2)].flatMap(() => [...Array(10)].map((_, i) => (
          <div key={i} className="w-full h-12 flex items-center justify-center">
            {i}
          </div>
        )))}
      </div>
    </div>
  );
};

const SlotMachine: React.FC<SlotMachineProps> = ({ winningNumber, onAnimationEnd }) => {
  // Pad to 3 digits and split, robust for both number and string inputs
  const paddedNumber = String(winningNumber).padStart(3, '0');
  const digits = paddedNumber.split('').map(Number);

  useEffect(() => {
    const totalAnimationTime = 1000 + 1500 + 2000 + 1000; // Sum of delays + final wait
    const timer = setTimeout(onAnimationEnd, totalAnimationTime);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6 glassmorphism rounded-xl">
       <h2 className="text-2xl font-poppins font-bold text-cyan-400 neon-accent">¡El número ganador es!</h2>
      <div className="flex space-x-4">
        <Reel finalDigit={digits[0]} delay={1000} />
        <Reel finalDigit={digits[1]} delay={1500} />
        <Reel finalDigit={digits[2]} delay={2000} />
      </div>
    </div>
  );
};

export default SlotMachine;