
import React, { useState } from 'react';

const ClaimsScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<'success' | 'error' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage(null);
    setSubmitMessageType(null);

    // Simulate API call
    setTimeout(() => {
      // Basic validation example (can be expanded)
      if (!fullName || !email || !subject || !description) {
        setSubmitMessage('Por favor, complete todos los campos obligatorios.');
        setSubmitMessageType('error');
        setIsLoading(false);
        return;
      }

      // Simulate success
      setSubmitMessage('Su reclamo/sugerencia ha sido enviado con éxito (simulación). Gracias por sus comentarios.');
      setSubmitMessageType('success');
      setFullName('');
      setEmail('');
      setTicketNumber('');
      setSubject('');
      setDescription('');
      setIsLoading(false);
    }, 1500);
  };

  const inputClasses = "w-full px-4 py-3 bg-[#1a1a1a] text-white border-b-2 border-[#f7ca18] focus:outline-none focus:border-yellow-300 rounded-t-md placeholder-gray-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <section className="claims-screen mt-12 mb-12 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-['Orbitron'] text-white">Formulario de Reclamos y Sugerencias</h2>
        <p className="text-gray-400 mt-1">Su opinión es importante para nosotros. Por favor, describa su caso.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#2a1d5e] p-6 sm:p-8 rounded-lg shadow-xl max-w-lg mx-auto"
      >
        <div className="mb-6">
          <label htmlFor="fullName" className={labelClasses}>Nombre Completo <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClasses}
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className={labelClasses}>Correo Electrónico <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="Ej: juan.perez@correo.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="ticketNumber" className={labelClasses}>Número de Ticket (Opcional)</label>
          <input
            type="text"
            id="ticketNumber"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            className={inputClasses}
            placeholder="Ej: 01234"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="subject" className={labelClasses}>Asunto <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClasses}
            placeholder="Ej: Problema con mi premio"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className={labelClasses}>Descripción Detallada <span className="text-red-500">*</span></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClasses} min-h-[120px] resize-y`}
            placeholder="Describa su reclamo o sugerencia aquí..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#f7ca18] text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar Reclamo/Sugerencia'}
        </button>

        {submitMessage && !isLoading && (
          <div className={`mt-6 p-4 rounded-md text-center text-sm ${
              submitMessageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
            {submitMessage}
          </div>
        )}
      </form>
      <p className="text-xs text-gray-500 mt-8 text-center">
        Esta es una simulación. El envío real requiere una configuración de backend.
      </p>
    </section>
  );
};

export default ClaimsScreen;
