import React from 'react';

const PukatuLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pukatuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#c026d3" />
      </linearGradient>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <style>
      {`
        @keyframes pulse {
          0%, 100% {
            filter: url(#neon-glow) drop-shadow(0 0 3px #00FFAA);
          }
          50% {
            filter: url(#neon-glow) drop-shadow(0 0 8px #ff6bff);
          }
        }
        .pukatu-logo-path {
          animation: pulse 4s ease-in-out infinite;
        }
      `}
    </style>
    <g className="pukatu-logo-path">
      <path
        fill="url(#pukatuGradient)"
        d="M20,10 H70 C81.0457,10 90,18.9543 90,30 V70 C90,81.0457 81.0457,90 70,90 H20 V10 Z M40,30 H55 C60.5228,30 65,34.4772 65,40 V45 C65,50.5228 60.5228,55 55,55 H40 V30 Z"
      />
      <circle cx="20" cy="50" r="10" fill="#0f172a" />
    </g>
  </svg>
);

export default PukatuLogo;