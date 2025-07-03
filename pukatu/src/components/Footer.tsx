import React from 'react';

interface FooterProps {
  onShowTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms }) => {
  return (
    <footer className="bg-[#2a1d5e] text-center py-6 mt-12">
      <div className="container mx-auto px-4">
        <button
          onClick={onShowTerms}
          className="text-gray-300 hover:text-white transition-colors underline"
        >
          Términos y Condiciones
        </button>
         <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} Pukatu Sorteos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;