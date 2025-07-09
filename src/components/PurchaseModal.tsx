import React, { useState, useEffect } from 'react';
import type { Buyer } from '../core/types';
import { PaymentMethod } from '../core/types';

interface PurchaseModalProps {
  numberToBuy: number | string;
  onClose: () => void;
  onConfirm: (buyer: Buyer) => void;
  isMillionBag?: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ numberToBuy, onClose, onConfirm, isMillionBag = false }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isMillionBag ? PaymentMethod.PagoMovil : PaymentMethod.Cash);
  const [ci, setCi] = useState('');
  const [pagoMovilPhone, setPagoMovilPhone] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isMillionBag) {
        const timestamp = Date.now();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        setReference(`PM-${timestamp}-${randomDigits}`);
    }
  }, [isMillionBag]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone) {
      setError('Nombre y teléfono de contacto son requeridos.');
      return;
    }
     if (!/^\d{10,11}$/.test(phone.replace(/\s/g, ''))) {
      setError('Por favor, ingrese un número de teléfono de contacto válido.');
      return;
    }

    if(isMillionBag) {
        if(!ci || !pagoMovilPhone) {
            setError('Para Pago Móvil, la Cédula y el Teléfono asociado son requeridos.');
            return;
        }
        if(!/^[VvEe]-?\d{6,8}$/.test(ci)){
            setError('Formato de Cédula inválido. Use V-12345678.');
            return;
        }
        if(!/^04(12|14|16|24|26)\d{7}$/.test(pagoMovilPhone)){
            setError('Formato de Teléfono para Pago Móvil inválido.');
            return;
        }
    }

    onConfirm({ name, phone, paymentMethod, ci, pagoMovilPhone, reference });
  };
  
  const paymentOptions = isMillionBag 
    ? [<option key={PaymentMethod.PagoMovil} value={PaymentMethod.PagoMovil}>{PaymentMethod.PagoMovil}</option>] 
    : Object.values(PaymentMethod).map(method => (
        <option key={method} value={method}>{method}</option>
    ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-poppins font-bold">Comprar Número <span className={isMillionBag ? "text-gold" : "text-cyan-400 neon-accent"}>{String(numberToBuy).padStart(3, '0')}</span></h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Teléfono de Contacto (WhatsApp)</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-300 mb-1">Método de Pago</label>
            <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} disabled={isMillionBag} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-slate-800">
              {paymentOptions}
            </select>
          </div>
          {isMillionBag && (
            <div className='bg-slate-900/50 p-3 rounded-lg border border-slate-700 space-y-4'>
                <p className='text-sm text-yellow-300'>Complete los datos del Pago Móvil que realizará.</p>
                <div>
                    <label htmlFor="ci" className="block text-sm font-medium text-slate-300 mb-1">Cédula del Titular de la cuenta</label>
                    <input type="text" placeholder='V-12345678' id="ci" value={ci} onChange={(e) => setCi(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                    <label htmlFor="pagoMovilPhone" className="block text-sm font-medium text-slate-300 mb-1">Teléfono Asociado a Pago Móvil</label>
                    <input type="tel" placeholder='04121234567' id="pagoMovilPhone" value={pagoMovilPhone} onChange={(e) => setPagoMovilPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                 <div className='text-center text-slate-400'>
                    Su referencia de pago es: <strong className='text-white'>{reference}</strong>
                 </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">Cancelar</button>
            <button type="submit" className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${isMillionBag ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20' : 'text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'}`}>Confirmar Compra</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;