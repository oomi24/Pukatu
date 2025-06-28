import React, { useState, useEffect, useCallback } from 'react';
import type { RaffleItem, UUID } from '../types';

interface AddRaffleModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (newRaffle: RaffleItem) => void;
  adminId: UUID;
  adminWhatsApp?: string;
}

const AddRaffleModal: React.FC<AddRaffleModalProps> = ({ show, onClose, onAdd, adminId, adminWhatsApp }) => {
  // const [raffleType, setRaffleType] = useState<RaffleItem['raffleType']>('grid'); // Default to grid
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState('');
  const [ticketCost, setTicketCost] = useState<number | string>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [targetDateStr, setTargetDateStr] = useState<string>('');

  // Grid specific fields (now primary)
  const [raffleTitle, setRaffleTitle] = useState(''); 
  const [raffleSubtitle, setRaffleSubtitle] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [prizeDetails, setPrizeDetails] = useState<string[]>(['']);
  const [gridNumbersTotal, setGridNumbersTotal] = useState<number | string>(100);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFormFields = useCallback(() => {
    // setRaffleType('grid'); // No longer needed to set, it's fixed
    setImageUrl('');
    setImagePreview(null);
    setDescription('');
    setConditions('');
    setTicketCost('');
    setIsFeatured(false);
    setTargetDateStr('');
    setImageFile(null);
    setRaffleTitle('');
    setRaffleSubtitle('');
    setCallToAction('');
    setPrizeDetails(['']);
    setGridNumbersTotal(100);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (show) {
      resetFormFields();
    }
  }, [show, resetFormFields]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        setErrorMessage("El archivo es demasiado grande. Máximo 2MB.");
        setImageFile(null); setImagePreview(null); setImageUrl(''); return;
      }
      setErrorMessage(null); setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); setImageUrl(''); };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null); setImagePreview(null);
    }
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (e.target.value) { setImageFile(null); setImagePreview(e.target.value); } 
    else if (!imageFile) { setImagePreview(null); }
  };

  const handlePrizeDetailChange = (index: number, value: string) => {
    const newPrizeDetails = [...prizeDetails];
    newPrizeDetails[index] = value;
    setPrizeDetails(newPrizeDetails);
  };

  const addPrizeDetailField = () => setPrizeDetails([...prizeDetails, '']);
  const removePrizeDetailField = (index: number) => {
    if (prizeDetails.length > 1) {
      setPrizeDetails(prizeDetails.filter((_, i) => i !== index));
    } else {
      setPrizeDetails(['']); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!raffleTitle.trim()) {
      setErrorMessage("El título principal del sorteo no puede estar vacío.");
      return;
    }
    const cost = parseFloat(String(ticketCost));
    if (isNaN(cost) || cost < 0) {
      setErrorMessage("El costo del ticket debe ser un número positivo."); return;
    }
    if (!imageUrl.trim() && !imageFile) {
      setErrorMessage("Se requiere una imagen para el sorteo."); return;
    }
    
    const parsedGridTotal = parseInt(String(gridNumbersTotal), 10);
    if (isNaN(parsedGridTotal) || parsedGridTotal <= 0 || parsedGridTotal > 999) { 
        setErrorMessage("El total de números en cuadrícula debe ser un número positivo (ej: 100, máx 999)."); return;
    }
    if (prizeDetails.some(detail => !detail.trim())) {
        setErrorMessage("Todos los detalles de premios deben estar llenos."); return;
    }
    

    setIsLoading(true);
    let finalImageUrl = imageUrl.trim();
    if (imageFile) finalImageUrl = imagePreview || 'https://picsum.photos/seed/newGridRaffle/300/120'; 

    const newTargetDateISO = targetDateStr ? new Date(targetDateStr).toISOString() : undefined;
    let newDayString = "-"; let newMonthString = "N/A"; let newDateDisplayString = "Fecha no definida";
    if (newTargetDateISO) {
        const dateObj = new Date(newTargetDateISO);
        newDayString = dateObj.getDate().toString();
        const monthName = dateObj.toLocaleString('es-ES', { month: 'long' });
        newMonthString = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        newDateDisplayString = `${newDayString}/${newMonthString.toUpperCase()}/${dateObj.getFullYear()}`;
    }
    
    const newRaffle: RaffleItem = {
      id: `raffle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      raffleType: 'grid', // Fixed to grid
      name: raffleTitle.trim(), // Using raffleTitle also for internal name reference
      imageUrl: finalImageUrl,
      ticketPurchaseLink: '#', ticketCheckLink: '#',
      day: newDayString, month: newMonthString, date: newDateDisplayString,
      progressPercentage: 0,
      targetDate: newTargetDateISO,
      administratorWhatsApp: adminWhatsApp,
      managedByAdminId: adminId,
      ticketCost: cost,
      description: description.trim() || undefined,
      conditions: conditions.trim() || undefined,
      isFeatured: isFeatured,
      
      raffleTitle: raffleTitle.trim(),
      raffleSubtitle: raffleSubtitle.trim() || undefined,
      callToAction: callToAction.trim() || undefined,
      prizeDetails: prizeDetails.filter(d => d.trim()),
      gridNumbersTotal: parsedGridTotal,
      soldNumbers: [], 
    };
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    onAdd(newRaffle);
    setIsLoading(false);
    onClose(); 
  };

  if (!show) return null;

  const inputClasses = "w-full px-3 py-2.5 bg-[#1a1a1a] text-white border border-gray-600 focus:border-[#f7ca18] focus:outline-none focus:ring-1 focus:ring-[#f7ca18] rounded-md placeholder-gray-500 text-sm";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1";
  const textareaClasses = `${inputClasses} min-h-[60px] resize-y`;
  const checkboxLabelClasses = "flex items-center text-sm text-gray-300 cursor-pointer";
  const checkboxClasses = "h-4 w-4 text-[#f7ca18] border-gray-500 rounded focus:ring-[#f7ca18] accent-[#f7ca18] mr-2";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-purple-600/30">
          <h5 className="text-lg font-semibold font-['Orbitron'] text-[#f7ca18]" id="addRaffleModalLabel">Crear Nuevo Sorteo (Estilo Cuadrícula)</h5>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3">
          {/* raffleType select removed */}
          <div>
            <label htmlFor="raffleTitle" className={labelClasses}>Título Principal <span className="text-red-500">*</span></label>
            <input type="text" id="raffleTitle" value={raffleTitle} onChange={(e) => setRaffleTitle(e.target.value)} className={inputClasses} placeholder="Ej: GRAN RIFA ESPECIAL" required disabled={isLoading}/>
          </div>
          <div>
            <label htmlFor="raffleSubtitle" className={labelClasses}>Subtítulo</label>
            <input type="text" id="raffleSubtitle" value={raffleSubtitle} onChange={(e) => setRaffleSubtitle(e.target.value)} className={inputClasses} placeholder="Ej: CON TU NÚMERO DE LA SUERTE" disabled={isLoading}/>
          </div>
          <div>
            <label htmlFor="callToAction" className={labelClasses}>Llamada a la Acción</label>
            <input type="text" id="callToAction" value={callToAction} onChange={(e) => setCallToAction(e.target.value)} className={inputClasses} placeholder="Ej: ¡PARTICIPA YA!" disabled={isLoading}/>
          </div>
          
          <div>
            <label htmlFor="description" className={labelClasses}>Descripción Detallada</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={textareaClasses} placeholder="Describe el sorteo..." disabled={isLoading}/>
          </div>
          <div>
            <label htmlFor="conditions" className={labelClasses}>Condiciones Específicas</label>
            <textarea id="conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} className={textareaClasses} placeholder="Ej: Solo para mayores de 18." disabled={isLoading}/>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ticketCost" className={labelClasses}>Costo del Ticket ($) <span className="text-red-500">*</span></label>
              <input type="number" id="ticketCost" value={ticketCost} onChange={(e) => setTicketCost(e.target.value)} className={inputClasses} placeholder="Ej: 10" min="0" step="0.01" required disabled={isLoading}/>
            </div>
            <div>
              <label htmlFor="gridNumbersTotal" className={labelClasses}>Total de Números en Cuadrícula <span className="text-red-500">*</span></label>
              <input type="number" id="gridNumbersTotal" value={gridNumbersTotal} onChange={(e) => setGridNumbersTotal(e.target.value)} className={inputClasses} placeholder="Ej: 100" min="10" max="999" step="1" required disabled={isLoading}/>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={labelClasses}>Detalles de los Premios <span className="text-red-500">*</span></label>
            {prizeDetails.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => handlePrizeDetailChange(index, e.target.value)}
                  className={inputClasses}
                  placeholder={`Ej: 1er Premio: Moto`}
                  required
                  disabled={isLoading}
                />
                {prizeDetails.length > 1 && (
                  <button type="button" onClick={() => removePrizeDetailField(index)} className="text-red-500 hover:text-red-400 p-1" title="Eliminar detalle" disabled={isLoading}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPrizeDetailField} className="text-xs text-green-400 hover:text-green-300 underline" disabled={isLoading}>+ Añadir otro premio</button>
          </div>

          <div>
            <label htmlFor="targetDateStr" className={labelClasses}>Fecha Límite (Opcional, para fin del sorteo)</label>
            <input type="datetime-local" id="targetDateStr" value={targetDateStr} onChange={(e) => setTargetDateStr(e.target.value)} className={inputClasses} disabled={isLoading}/>
          </div>
          <div>
            <label htmlFor="imageUrl" className={labelClasses}>URL de Imagen <span className="text-red-500">*</span></label>
            <input type="url" id="imageUrl" value={imageUrl} onChange={handleImageUrlChange} className={inputClasses} placeholder="https://ejemplo.com/img.jpg" disabled={isLoading || !!imageFile} />
          </div>
          <div className="text-center text-xs text-gray-400">O</div>
          <div>
            <label htmlFor="imageFile" className={labelClasses}>Subir Imagen (Max 2MB) <span className="text-red-500">*</span></label>
            <input type="file" id="imageFile" onChange={handleFileChange} className={`${inputClasses} cursor-pointer file:mr-3`} accept="image/*" disabled={isLoading}/>
          </div>
          {imagePreview && (<div className="mt-2 flex justify-center"><img src={imagePreview} alt="Vista previa" className="max-h-36 rounded border border-gray-600"/></div>)}

          <div className="pt-2">
            <label className={checkboxLabelClasses}>
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className={checkboxClasses} disabled={isLoading}/>Marcar Destacado
            </label>
          </div>
          {errorMessage && (<div className="p-3 rounded-md text-sm text-center bg-red-700 text-white">{errorMessage}</div>)}
          <div className="pt-3">
            <button type="submit" disabled={isLoading} className="w-full bg-[#f7ca18] text-black font-bold py-2.5 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? 'Creando...' : 'Crear Sorteo'}
            </button>
          </div>
        </form>
        <div className="p-4 border-t border-purple-600/30 text-right mt-auto">
          <button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-500 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
};
export default AddRaffleModal;