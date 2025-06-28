
import React from 'react';

interface TicketIconProps {
  className?: string;
}

const TicketIcon: React.FC<TicketIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={className || "w-5 h-5"}
  >
    <path d="M2.905 5.485C1.86 6.368 1 7.613 1 9c0 1.387.86 2.632 1.905 3.515C1.86 13.368 1 14.613 1 16c0 1.657 2.164 3 4.887 3h8.226C16.836 19 19 17.657 19 16c0-1.387-.86-2.632-1.905-3.515C18.14 11.632 19 10.387 19 9c0-1.387-.86-2.632-1.905-3.515C18.14 4.632 19 3.387 19 2c0-1.657-2.164-2-4.887-2H5.887C3.164 0 1 1.343 1 3c0 1.387.86 2.632 1.905 2.485zM5.5 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm4.5-8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

export default TicketIcon;
