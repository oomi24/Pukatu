import React, { useState, useEffect, useCallback } from 'react';
import type { RaffleItem } from '../types';

interface EditRaffleModalProps {
  show: boolean;
  onClose: () => void;
  raffleItem: RaffleItem | null; // Will always be 'grid' type based on new app structure
  onSave: (updatedRaffle: RaffleItem) => void;
}

const EditRaffleModal: React.FC<EditRaffleModalProps> = ({ show, onClose, raffleItem, onSave }) => {
  // const [editableRaffleType, setEditableRaffleType] = useState<RaffleItem['raffleType']>('grid'); // Fixed to grid
  const [editableImageUrl, setEditableImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [editableDescription, setEditableDescription] = useState('');
  const [editableConditions, setEditableConditions] = useState('');
  const [editableTicketCost, setEditableTicketCost] = useState<number | string>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [editableTargetDate, setEditableTargetDate] = useState<string>('');

  // Grid specific (now primary)
  const [editableRaffleTitle, setEditableRaffleTitle] = useState('');
  const [editableRaffleSubtitle, setEditableRaffleSubtitle] = useState('');
  const [editableCallToAction, setEditableCallToAction] = useState('');
  const [editablePrizeDetails, setEditablePrizeDetails] = useState<string[]>(['']);
  const [editableGridNumbersTotal, setEditableGridNumbersTotal] = useState<number | string>(100);
  const [editableGridStartNumber, setEditableGridStartNumber] = useState<number | string>(1);
  const [editableSoldNumbersStr, setEditableSoldNumbersStr] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFormFields = useCallback(() => {
    if (raffleItem) {
      // setEditableRaffleType('grid'); // Fixed
      setEditableImageUrl(raffleItem.imageUrl || '');
      setImagePreview(raffleItem.imageUrl || null);
      setEditableDescription(raffleItem.description || '');
      setEditableConditions(raffleItem.conditions || '');
      setEditableTicketCost(raffleItem.ticketCost !== undefined ? String(raffleItem.ticketCost) : '');
      setIsFeatured(raffleItem.isFeatured || false);
      
      setEditableRaffleTitle(raffleItem.raffleTitle || '');
      setEditableRaffleSubtitle(raffleItem.raffleSubtitle || '');
      setEditableCallToAction(raffleItem.callToAction || '');
      setEditablePrizeDetails(raffleItem.prizeDetails && raffleItem.prizeDetails.length > 0 ? raffleItem.prizeDetails : ['']);
      setEditableGridNumbersTotal(String(raffleItem.gridNumbersTotal || 100));
      setEditableGridStartNumber(String(raffleItem.gridStartNumber ?? 1));
      setEditableSoldNumbersStr(raffleItem.soldNumbers ? raffleItem.soldNumbers.join(', ') : '');

      if (raffleItem.targetDate) {
        const date = new Date(raffleItem.targetDate);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setEditableTargetDate(localDateTime);
      } else {
        setEditableTargetDate('');
      }
    } else {
      // Fallback if raffleItem is somehow null, though modal shouldn't show
      setEditableImageUrl(''); setImagePreview(null);
      setEditableDescription(''); setEditableConditions(''); setEditableTicketCost('');
      setIsFeatured(false); setEditableTargetDate('');
      setEditableRaffleTitle(''); setEditableRaffleSubtitle(''); setEditableCallToAction('');
      setEditablePrizeDetails(['']); setEditableGridNumbersTotal(100); setEditableGridStartNumber(1); setEditableSoldNumbersStr('');
    }
    setImageFile(null); setErrorMessage(null);
  }, [raffleItem]);

  useEffect(() => { if (show) resetFormFields(); }, [show, resetFormFields]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        setErrorMessage("Max 2MB."); setImageFile(null); setImagePreview(raffleItem?.imageUrl || null); setEditableImageUrl(raffleItem?.imageUrl || ''); return;
      }
      setErrorMessage(null); setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); setEditableImageUrl(''); };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null); setImagePreview(raffleItem?.imageUrl || null); setEditableImageUrl(raffleItem?.imageUrl || '');
    }
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableImageUrl(e.target.value);
    if (e.target.value) { setImageFile(null); setImagePreview(e.target.value); } 
    else if (!imageFile) { setImagePreview(raffleItem?.imageUrl || null); }
  };

  const handlePrizeDetailChange = (index: number, value: string) => {
    const newPrizeDetails = [...editablePrizeDetails]; newPrizeDetails[index] = value; setEditablePrizeDetails(newPrizeDetails);
  };
  const addPrizeDetailField = () => setEditablePrizeDetails([...editablePrizeDetails, '']);
  const removePrizeDetailField = (index: number) => {
    if (editablePrizeDetails.length > 1) setEditablePrizeDetails(editablePrizeDetails.filter((_, i) => i !== index));
    else setEditablePrizeDetails(['']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raffleItem) return;
    setErrorMessage(null);

    if (!editableRaffleTitle.trim()) {
      setErrorMessage("Título principal es obligatorio."); return;
    }
    const cost = parseFloat(String(editableTicketCost));
    if (isNaN(cost) || cost < 0) {
      setErrorMessage("Costo del ticket debe ser número positivo."); return;
    }

    let finalImageUrl = editableImageUrl.trim();
    if (imageFile) finalImageUrl = imagePreview || raffleItem.imageUrl;
    else if (!finalImageUrl && raffleItem.imageUrl) finalImageUrl = raffleItem.imageUrl;
    else if (!finalImageUrl && !raffleItem.imageUrl) { setErrorMessage("Se requiere imagen."); setIsLoading(false); return; }

    const parsedGridTotal = parseInt(String(editableGridNumbersTotal), 10);
    const parsedGridStartNumber = parseInt(String(editableGridStartNumber), 10);
    if (isNaN(parsedGridTotal) || parsedGridTotal <= 0 || parsedGridTotal > 1000) { setErrorMessage("Total Cuadrícula: número >0, <=1000."); return; }
     if (isNaN(parsedGridStartNumber) || parsedGridStartNumber < 0) {
      setErrorMessage("Número inicial debe ser un número positivo o cero."); return;
    }
    if (editablePrizeDetails.some(d => !d.trim())) { setErrorMessage("Detalles de premios obligatorios."); return; }
    
    let parsedSoldNumbers: number[] | undefined = editableSoldNumbersStr.split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n >= parsedGridStartNumber && n < (parsedGridStartNumber + parsedGridTotal));
    if (editableSoldNumbersStr.trim() && parsedSoldNumbers.length === 0 && editableSoldNumbersStr.split(',').some(s => s.trim() !== '')) {
        const invalidInputs = editableSoldNumbersStr.split(',').filter(s => isNaN(parseInt(s.trim(),10)) && s.trim() !== '');
        if (invalidInputs.length > 0) {
             setErrorMessage(`Números vendidos inválidos: ${invalidInputs.join(', ')}. Use solo números separados por comas.`); return;
        }
    }
    if(parsedSoldNumbers.length === 0) parsedSoldNumbers = undefined; // store as undefined if empty after processing
    
    setIsLoading(true);
    const newTargetDateISO = editableTargetDate ? new Date(editableTargetDate).toISOString() : undefined;
    let newDayString = raffleItem.day; let newMonthString = raffleItem.month; let newDateDisplayString = raffleItem.date;
    if (newTargetDateISO) {
        const dateObj = new Date(newTargetDateISO); newDayString = dateObj.getDate().toString();
        const monthName = dateObj.toLocaleString('es-ES', { month: 'long' });
        newMonthString = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        newDateDisplayString = `${newDayString}/${newMonthString.toUpperCase()}/${dateObj.getFullYear()}`;
    } else {
        newDayString = "-"; newMonthString = "N/A"; newDateDisplayString = "Fecha no definida";
    }

    const updatedRaffle: RaffleItem = {
      ...raffleItem,
      raffleType: 'grid', // Fixed to grid
      name: editableRaffleTitle.trim(), // Using raffleTitle also for internal name reference
      imageUrl: finalImageUrl,
      description: editableDescription.trim() || undefined,
      conditions: editableConditions.trim() || undefined,
      ticketCost: cost,
      isFeatured: isFeatured,
      targetDate: newTargetDateISO,
      day: newDayString, month: newMonthString, date: newDateDisplayString,
      
      raffleTitle: editableRaffleTitle.trim(),
      raffleSubtitle: editableRaffleSubtitle.trim() || undefined,
      callToAction: editableCallToAction.trim() || undefined,
      prizeDetails: editablePrizeDetails.filter(d => d.trim()),
      gridNumbersTotal: parsedGridTotal,
      gridStartNumber: parsedGridStartNumber,
      soldNumbers: parsedSoldNumbers,
    };
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    onSave(updatedRaffle);
    setIsLoading(false);
    onClose(); 
  };

  if (!show || !raffleItem) return null;

  const inputClasses = "w-full px-3 py-2.5 bg-[#1a1a1a] text-white border border-gray-600 focus:border-[#f7ca18] focus:outline-none focus:ring-1 focus:ring-[#f7ca18] rounded-md placeholder-gray-500 text-sm";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1";
  const textareaClasses = `${inputClasses} min-h-[60px] resize-y`;
  const checkboxLabelClasses = "flex items-center text-sm text-gray-300 cursor-pointer";
  const checkboxClasses = "h-4 w-4 text-[#f7ca18] border-gray-500 rounded focus:ring-[#f7ca18] accent-[#f7ca18] mr-2";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1e1442] text-white border border-purple-700/50 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-purple-600/30">
          <h5 className="text-lg font-semibold font-['Orbitron'] text-[#f7ca18]" id="editRaffleModalLabel">Editar Sorteo: <span className="text-white truncate">{raffleItem.raffleTitle}</span></h5>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3">
          {/* raffleType select removed */}
          <div><label htmlFor="editableRaffleTitle" className={labelClasses}>Título Principal <span className="text-red-500">*</span></label><input type="text" id="editableRaffleTitle" value={editableRaffleTitle} onChange={(e) => setEditableRaffleTitle(e.target.value)} className={inputClasses} required disabled={isLoading}/></div>
          <div><label htmlFor="editableRaffleSubtitle" className={labelClasses}>Subtítulo</label><input type="text" id="editableRaffleSubtitle" value={editableRaffleSubtitle} onChange={(e) => setEditableRaffleSubtitle(e.target.value)} className={inputClasses} disabled={isLoading}/></div>
          <div><label htmlFor="editableCallToAction" className={labelClasses}>Llamada a Acción</label><input type="text" id="editableCallToAction" value={editableCallToAction} onChange={(e) => setEditableCallToAction(e.target.value)} className={inputClasses} disabled={isLoading}/></div>
          
          <div><label htmlFor="editableDescription" className={labelClasses}>Descripción</label><textarea id="editableDescription" value={editableDescription} onChange={(e) => setEditableDescription(e.target.value)} className={textareaClasses} disabled={isLoading}/></div>
          <div><label htmlFor="editableConditions" className={labelClasses}>Condiciones</label><textarea id="editableConditions" value={editableConditions} onChange={(e) => setEditableConditions(e.target.value)} className={textareaClasses} disabled={isLoading}/></div>
          
          <div className="grid grid-cols-3 gap-4">
            <div><label htmlFor="editableTicketCost" className={labelClasses}>Costo Ticket ($) <span className="text-red-500">*</span></label><input type="number" id="editableTicketCost" value={editableTicketCost} onChange={(e) => setEditableTicketCost(e.target.value)} className={inputClasses} min="0" step="0.01" required disabled={isLoading}/></div>
            <div><label htmlFor="editableGridNumbersTotal" className={labelClasses}># Total <span className="text-red-500">*</span></label><input type="number" id="editableGridNumbersTotal" value={editableGridNumbersTotal} onChange={(e) => setEditableGridNumbersTotal(e.target.value)} className={inputClasses} min="10" max="1000" step="1" required disabled={isLoading}/></div>
            <div><label htmlFor="editableGridStartNumber" className={labelClasses}># Inicial <span className="text-red-500">*</span></label><input type="number" id="editableGridStartNumber" value={editableGridStartNumber} onChange={(e) => setEditableGridStartNumber(e.target.value)} className={inputClasses} min="0" step="1" required disabled={isLoading}/></div>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Detalles Premios <span className="text-red-500">*</span></label>
            {editablePrizeDetails.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="text" value={detail} onChange={(e) => handlePrizeDetailChange(index, e.target.value)} className={inputClasses} required disabled={isLoading}/>
                {editablePrizeDetails.length > 1 && (<button type="button" onClick={() => removePrizeDetailField(index)} className="text-red-500 p-1" disabled={isLoading}>X</button>)}
              </div>
            ))}
            <button type="button" onClick={addPrizeDetailField} className="text-xs text-green-400 underline" disabled={isLoading}>+ Añadir premio</button>
            <div>
              <label htmlFor="editableSoldNumbersStr" className={labelClasses}>Números Vendidos (separados por coma)</label>
              <input type="text" id="editableSoldNumbersStr" value={editableSoldNumbersStr} onChange={(e) => setEditableSoldNumbersStr(e.target.value)} className={inputClasses} placeholder="Ej: 1, 5, 12, 23" disabled={isLoading}/>
            </div>
          </div>
          
          <div><label htmlFor="editableTargetDate" className={labelClasses}>Fecha Límite</label><input type="datetime-local" id="editableTargetDate" value={editableTargetDate} onChange={(e) => setEditableTargetDate(e.target.value)} className={inputClasses} disabled={isLoading}/>{editableTargetDate && (<button type="button" onClick={() => setEditableTargetDate('')} className="text-xs text-red-400 underline mt-1" disabled={isLoading}>Limpiar</button>)}</div>
          <div><label htmlFor="editableImageUrl" className={labelClasses}>URL Imagen</label><input type="url" id="editableImageUrl" value={editableImageUrl} onChange={handleImageUrlChange} className={inputClasses} disabled={isLoading || !!imageFile} /></div>
          <div className="text-center text-xs text-gray-400">O</div>
          <div><label htmlFor="imageFile" className={labelClasses}>Subir Imagen (Max 2MB)</label><input type="file" id="imageFile" onChange={handleFileChange} className={`${inputClasses} cursor-pointer file:mr-3`} accept="image/*" disabled={isLoading}/></div>
          {imagePreview && (<div className="mt-2 flex justify-center"><img src={imagePreview} alt="Vista previa" className="max-h-36 rounded border border-gray-600"/></div>)}

          <div className="pt-2"><label className={checkboxLabelClasses}><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className={checkboxClasses} disabled={isLoading}/>Destacado</label></div>
          {errorMessage && (<div className="p-3 rounded-md text-sm text-center bg-red-700 text-white">{errorMessage}</div>)}
          <div className="pt-3"><button type="submit" disabled={isLoading} className="w-full bg-[#f7ca18] text-black font-bold py-2.5 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed">{isLoading ? 'Guardando...' : 'Guardar Cambios'}</button></div>
        </form>
        <div className="p-4 border-t border-purple-600/30 text-right mt-auto"><button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-500 transition-colors">Cancelar</button></div>
      </div>
    </div>
  );
};
export default EditRaffleModal;