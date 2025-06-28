import React from 'react';

interface FloatingActionsProps {
  onNavigateToClaimsScreen: () => void;
  mainWhatsAppGroupUrl: string;
}

// Using generic icons as placeholders for Devolución and WhatsApp
const DevolucionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.173-.172.223-.296.322-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);


const FloatingActions: React.FC<FloatingActionsProps> = ({ onNavigateToClaimsScreen, mainWhatsAppGroupUrl }) => {
  return (
    <>
      <button
        onClick={onNavigateToClaimsScreen} 
        className="fixed left-3 bottom-20 sm:left-5 sm:bottom-24 z-50 p-3 bg-[#2a1d5e] rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:outline-none"
        aria-label="Formulario de Reclamos y Sugerencias"
      >
        <DevolucionIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#f7ca18]" />
      </button>
      
      <a
        href={mainWhatsAppGroupUrl || "https://chat.whatsapp.com/"} // Fallback if URL is somehow empty
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-3 bottom-20 sm:right-5 sm:bottom-24 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Unirse al Grupo de WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      </a>
    </>
  );
};

export default FloatingActions;