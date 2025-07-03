import React from 'react';

const LeverIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
    <path d="M17 10V4a2 2 0 00-2-2h-1a2 2 0 00-2 2v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10H8c-2.21 0-4 1.79-4 4v0c0 2.21 1.79 4 4 4h1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 10h1c2.21 0 4 1.79 4 4v0c0 2.21-1.79 4-4 4h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17" cy="18" r="1" fill="currentColor"/>
  </svg>
);

export default LeverIcon;
