import React from 'react';

interface StarIconProps {
  className?: string;
  filled?: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ className, filled = true }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 1.5}
    className={className || "w-5 h-5"}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 1l2.928 5.945L19 7.828l-4.5 4.385L15.657 19 10 15.828 4.343 19l1.157-6.787L1 7.828l6.072-.883L10 1z"
      clipRule="evenodd"
    />
  </svg>
);

export default StarIcon;