import React from 'react';

const SlotMachineFrame: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="slotBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4c1d95" />
        <stop offset="100%" stopColor="#2a1d5e" />
      </linearGradient>
      <linearGradient id="slotScreenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#111827" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g>
      {/* Body */}
      <path d="M 30 20 H 290 A 10 10 0 0 1 300 30 V 240 A 10 10 0 0 1 290 250 H 30 A 10 10 0 0 1 20 240 V 30 A 10 10 0 0 1 30 20 Z" fill="url(#slotBodyGradient)" stroke="#f7b733" strokeWidth="2" />
      {/* Top Sign */}
      <rect x="80" y="5" width="160" height="30" rx="15" fill="#f7ca18" stroke="#000" strokeWidth="1.5" />
      <text x="160" y="27" fontFamily="'Orbitron', sans-serif" fontSize="18" fill="black" textAnchor="middle" fontWeight="bold">PUKATU</text>
      {/* Screen Bezel */}
      <rect x="45" y="65" width="230" height="110" rx="8" fill="#1e1442" stroke="#facc15" strokeWidth="2" />
      <rect x="50" y="70" width="220" height="100" rx="5" fill="url(#slotScreenGradient)" />
      {/* Lever */}
      <path d="M 310 60 l 0 70" stroke="#a1a1aa" strokeWidth="8" strokeLinecap="round" />
      <circle cx="310" cy="50" r="15" fill="#dc2626" stroke="#fef2f2" strokeWidth="2" />
      {/* Base */}
      <rect x="10" y="250" width="300" height="10" rx="5" fill="#1e1442" />
      {/* Lights */}
      <circle cx="25" cy="50" r="5" fill="#f7ca18" filter="url(#glow)" />
      <circle cx="25" cy="220" r="5" fill="#f7ca18" filter="url(#glow)" />
      <circle cx="295" cy="220" r="5" fill="#f7ca18" filter="url(#glow)" />
    </g>
  </svg>
);
export default SlotMachineFrame;
