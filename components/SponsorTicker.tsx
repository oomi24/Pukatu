
import React from 'react';

interface SponsorTickerProps {
  message: string;
  whatsAppNumber: string; // Expected in international format without '+' or spaces, e.g., 584120000000
}

const SponsorTicker: React.FC<SponsorTickerProps> = ({ message, whatsAppNumber }) => {
  const handleSponsorClick = () => {
    const cleanedWhatsAppNumber = whatsAppNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanedWhatsAppNumber}?text=${encodeURIComponent("Hola, estoy interesado en sus servicios de publicidad.")}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-gradient-to-r from-yellow-400 via-[#f7ca18] to-orange-400 text-black p-3 my-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleSponsorClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSponsorClick(); }}
      aria-label={`Contactar patrocinador: ${message}`}
    >
      <p className="text-sm font-semibold text-center">
        {message}
      </p>
    </div>
  );
};

export default SponsorTicker;
