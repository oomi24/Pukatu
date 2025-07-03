import React from 'react';

interface TermsModalProps {
  show: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  const terms = [
    "DEBE VERIFICAR LA DISPONIBILIDAD de los boletos antes de realizar el pago.",
    "NO SE REALIZAN DEVOLUCIONES DE PAGO bajo ningún concepto.",
    "LA COMPRA MÍNIMA ES DE 2 TICKETS para participar, se asignan de manera aleatoria y enviados a su correo después de confirmarse su pago.",
    "LOS PREMIOS DEBEN SER RETIRADOS en la dirección indicada por nosotros en cada sorteo, bajo excepción y previo acuerdo coordinamos la entrega personal del premio Mayor en la dirección del ganador, zona Segura.",
    "PARA RECLAMAR TU PREMIO tiene un lapso de 72 horas.",
    "LOS GANADORES AUTORIZAN aparecer en contenido audiovisual del sorteo, mostrando su presencia en las redes sociales y entrega de los premios. ESTO ES OBLIGATORIO.",
    "SOLO PODRÁN PARTICIPAR PERSONAS Mayores de 18 años con nacionalidad Venezolana o extranjeros que residan legalmente en Venezuela.",
    "RECIBIRÁ SUS BOLETOS después de verificarse su pago en un lapso MÍNIMO de 12 horas y un MÁXIMO de 72 horas.",
    "SI SUS BOLETOS NO LLEGAN es porque introdujo incorrectamente algún dato, debe usar el VERIFICADOR de la Web."
  ];

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="termsModalLabel"
    >
      <div
        className="bg-black text-white border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="p-5 border-b border-gray-700">
          <h5 className="text-xl font-semibold font-['Orbitron'] text-[#f7ca18]" id="termsModalLabel">
            Términos y Condiciones
          </h5>
        </div>
        <div className="p-5 overflow-y-auto space-y-3 text-sm text-gray-300 leading-relaxed">
          {terms.map((term, index) => (
            <p key={index}>{`${index + 1}.- ${term}`}</p>
          ))}
        </div>
        <div className="p-5 border-t border-gray-700 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f7ca18] text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;