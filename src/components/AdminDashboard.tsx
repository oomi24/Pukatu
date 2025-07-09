import React, { useState } from 'react';
import type { Raffle, AdminView, RaffleNumber, User, DrawTriggerConfig, MillionBagNumber } from '../core/types';
import { NumberStatus } from '../core/types';
import UserManagementView from './UserManagementView';

type CreateRaffleData = Pick<Raffle, 'description' | 'prizeImage' | 'terms' | 'size' | 'closeDate'>;

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  raffles: Raffle[];
  millionBag: Raffle;
  onUpdateRaffle: (updatedRaffle: Raffle) => void;
  onCreateRaffle: (newRaffle: CreateRaffleData) => void;
  onDeleteRaffle: (raffleId: string) => void;
  onUpdateMillionBag: (updatedBag: Raffle) => void;
  onCreateUser: (newUser: User) => void;
}

const RaffleEditModal: React.FC<{
  raffle: Raffle;
  admins: User[];
  onClose: () => void;
  onSave: (updatedRaffle: Raffle) => void;
  onDelete: (raffleId: string) => void;
}> = ({ raffle, admins, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Raffle>(raffle);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el sorteo "${raffle.description}"? Esta acción no se puede deshacer.`)) {
      onDelete(raffle.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-poppins font-bold mb-4">Editar Sorteo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Descripción del Premio</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-900 p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">URL de la Imagen</label>
            <input type="text" name="prizeImage" value={formData.prizeImage} onChange={handleChange} className="w-full bg-slate-900 p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Términos y Condiciones</label>
            <textarea name="terms" value={formData.terms} onChange={handleChange} className="w-full bg-slate-900 p-2 rounded h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Cierre</label>
            <input type="datetime-local" name="closeDate" value={formData.closeDate.substring(0, 16)} onChange={handleChange} className="w-full bg-slate-900 p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Asignar Administrador</label>
            <select name="managedBy" value={formData.managedBy || ''} onChange={handleChange} className="w-full bg-slate-900 p-2 rounded">
              <option value="">Sin Asignar</option>
              {admins.map(admin => <option key={admin.username} value={admin.username}>{admin.username}</option>)}
            </select>
          </div>
          <div className="flex justify-between items-center pt-4">
             <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">Eliminar Sorteo</button>
            <div className="flex space-x-2">
              <button onClick={onClose} className="px-4 py-2 bg-slate-600 rounded">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-cyan-500 rounded text-slate-900 font-bold">Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, users, raffles, onUpdateRaffle, onCreateRaffle, onDeleteRaffle, millionBag, onUpdateMillionBag, onCreateUser }) => {
  const [view, setView] = useState<AdminView>('raffles');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<Raffle | null>(null);

  const [mbDrawConfig, setMbDrawConfig] = useState(millionBag.drawConfig);
  const [mbCloseDate, setMbCloseDate] = useState(millionBag.closeDate.substring(0, 16));

  const TICKET_PRICE = 5; // Example price for regular raffles
  const COMMISSION_RATE = 0.03;

  const handleConfirmPayment = (raffleId: string, numberValue: number) => {
    const raffleToUpdate = raffles.find(r => r.id === raffleId);
    if (!raffleToUpdate) return;

    const updatedNumbers = raffleToUpdate.numbers.map(n =>
      (n as RaffleNumber).number === numberValue ? { ...n, status: NumberStatus.Sold } : n
    );
    onUpdateRaffle({ ...raffleToUpdate, numbers: updatedNumbers });
  };

  const handleConfirmMillionBagPayment = (numberValue: string) => {
    const updatedNumbers = millionBag.numbers.map(n =>
      (n as MillionBagNumber).number === numberValue ? { ...n, status: NumberStatus.Sold } : n
    );
    onUpdateMillionBag({ ...millionBag, numbers: updatedNumbers });
  };

  const handleToggleRaffleStatus = (raffleId: string) => {
    const raffleToUpdate = raffles.find(r => r.id === raffleId);
    if (!raffleToUpdate) return;
    onUpdateRaffle({ ...raffleToUpdate, isActive: !raffleToUpdate.isActive });
  };

  const handleToggleMillionBagStatus = () => {
    onUpdateMillionBag({ ...millionBag, isActive: !millionBag.isActive });
  };

  const handleResetMillionBag = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer el Bolso Millonario? Se perderán todos los datos de ventas y se generarán nuevos números.')) {
      onUpdateMillionBag({
        ...millionBag,
        numbers: Array.from({ length: 1000 }, (_, i) => ({ number: String(i).padStart(3, '0'), status: NumberStatus.Available })),
        winningNumber: null,
      });
    }
  };

  const handleSaveMillionBagConfig = () => {
    onUpdateMillionBag({
      ...millionBag,
      closeDate: new Date(mbCloseDate).toISOString(),
      drawConfig: mbDrawConfig
    });
    alert('Configuración del Bolso Millonario actualizada.');
  };

  const CreateRaffleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [description, setDescription] = useState('');
    const [prizeImage, setPrizeImage] = useState('https://picsum.photos/800/600');
    const [terms, setTerms] = useState('El ganador será contactado. El premio no es transferible.');
    const [size, setSize] = useState<100 | 1000>(100);
    const [closeDate, setCloseDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRaffleData: CreateRaffleData = {
        description, prizeImage, terms, size,
        closeDate: new Date(closeDate).toISOString(),
      };
      onCreateRaffle(newRaffleData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-poppins font-bold mb-4">Crear Nuevo Sorteo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Descripción del Premio" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-slate-900 p-2 rounded" />
            <input type="text" placeholder="URL de la Imagen del Premio" value={prizeImage} onChange={e => setPrizeImage(e.target.value)} required className="w-full bg-slate-900 p-2 rounded" />
            <textarea placeholder="Términos y Condiciones" value={terms} onChange={e => setTerms(e.target.value)} required className="w-full bg-slate-900 p-2 rounded h-24" />
            <select value={size} onChange={e => setSize(Number(e.target.value) as 100 | 1000)} className="w-full bg-slate-900 p-2 rounded">
              <option value={100}>100 Números</option>
              <option value={1000}>1000 Números</option>
            </select>
            <input type="datetime-local" value={closeDate} onChange={e => setCloseDate(e.target.value)} required className="w-full bg-slate-900 p-2 rounded" />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-cyan-500 rounded text-slate-900 font-bold">Crear</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const allViews: AdminView[] = ['raffles', 'millionBag', 'payments', 'finance'];
  if (currentUser.role === 'superadmin') {
    allViews.push('users');
  }

  const pendingPaymentsRaffles = raffles.flatMap(r =>
    r.numbers
      .filter(n => n.status === NumberStatus.Pending)
      .map(n => ({ ...n, raffleId: r.id, raffleDescription: r.description }))
  );

  const pendingPaymentsMillionBag = millionBag.numbers.filter(n => n.status === NumberStatus.Pending);

  const totalRevenue = raffles.reduce((acc, r) => {
    const soldTickets = r.numbers.filter(n => n.status === NumberStatus.Sold).length;
    return acc + (soldTickets * TICKET_PRICE);
  }, 0);
  const totalCommission = totalRevenue * COMMISSION_RATE;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-poppins font-bold mb-6 text-white">Panel de Administración</h1>

      <div className="mb-6 border-b border-slate-700">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto">
          {allViews.map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-2 font-medium text-sm rounded-t-lg capitalize whitespace-nowrap ${view === v ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              {v === 'millionBag' ? 'Bolso Millonario' : v}
            </button>
          ))}
        </nav>
      </div>

      {isCreateModalOpen && <CreateRaffleModal onClose={() => setCreateModalOpen(false)} />}
      {editingRaffle && (
        <RaffleEditModal
          raffle={editingRaffle}
          admins={users.filter(u => u.role === 'admin')}
          onClose={() => setEditingRaffle(null)}
          onSave={onUpdateRaffle}
          onDelete={onDeleteRaffle}
        />
      )}

      {view === 'users' && currentUser.role === 'superadmin' && (
        <UserManagementView currentUser={currentUser} users={users} onCreateUser={onCreateUser} />
      )}

      {view === 'raffles' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-poppins font-bold">Gestionar Sorteos</h2>
            {currentUser.role === 'superadmin' && <button onClick={() => setCreateModalOpen(true)} className="px-4 py-2 bg-cyan-500 text-slate-900 font-bold rounded">Crear Sorteo</button>}
          </div>
          <div className="space-y-4">
            {raffles.map(r => (
              <div key={r.id} className="glassmorphism p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-bold text-white">{r.description}</p>
                  <p className="text-sm text-slate-400">
                    {r.size} números - {r.isActive ? 'Activo' : 'Pausado'}
                    {r.managedBy && <span className="ml-2 text-xs bg-slate-700 px-2 py-0.5 rounded-full">Admin: {r.managedBy}</span>}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                    {currentUser.role === 'superadmin' && (
                        <button onClick={() => setEditingRaffle(r)} className="px-3 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600">
                            Editar
                        </button>
                    )}
                    <button onClick={() => handleToggleRaffleStatus(r.id)} className={`px-3 py-1 text-sm rounded ${r.isActive ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {r.isActive ? 'Pausar' : 'Activar'}
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'millionBag' && (
        <div>
          <h2 className="text-xl font-poppins font-bold mb-4">Gestionar Bolso Millonario</h2>
          <div className="glassmorphism p-6 rounded-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="font-bold text-white text-lg">Estado: <span className={millionBag.isActive ? 'text-green-400' : 'text-red-400'}>{millionBag.isActive ? 'Activo' : 'Inactivo'}</span></p>
              {currentUser.role === 'superadmin' && (
                  <button onClick={handleToggleMillionBagStatus} className={`px-4 py-2 text-sm font-bold rounded ${millionBag.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                    {millionBag.isActive ? 'Desactivar Bolso' : 'Activar Bolso'}
                  </button>
              )}
            </div>

            {currentUser.role === 'superadmin' && mbDrawConfig && (
              <>
                <div className="border-t border-slate-700 pt-4 super-admin-bg p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-4 super-admin-text">Configuración de Sorteo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Modo de Activación</label>
                      <select value={mbDrawConfig.mode} onChange={e => setMbDrawConfig({ ...mbDrawConfig, mode: e.target.value as DrawTriggerConfig['mode'] })} className="w-full p-2 rounded super-admin-input">
                        <option value="hybrid">Híbrido (Fecha o Venta Completa)</option>
                        <option value="date">Solo por Fecha Límite</option>
                        <option value="sales">Solo por Venta Completa</option>
                      </select>
                    </div>

                    {(mbDrawConfig.mode === 'date' || mbDrawConfig.mode === 'hybrid') && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Cierre</label>
                        <input type="datetime-local" value={mbCloseDate} onChange={e => setMbCloseDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded" />
                      </div>
                    )}

                    <div>
                      <button onClick={handleSaveMillionBagConfig} className="w-full px-4 py-2 bg-cyan-500 text-slate-900 font-bold rounded">Guardar Configuración</button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <button onClick={handleResetMillionBag} className="w-full px-4 py-2 text-sm font-bold rounded bg-orange-600 hover:bg-orange-700 text-white">
                    Restablecer Bolso (Acción Peligrosa)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === 'payments' && (
        <div>
          <h2 className="text-xl font-poppins font-bold mb-4">Pagos Pendientes de Sorteos</h2>
          <div className="space-y-3">
            {pendingPaymentsRaffles.length > 0 ? pendingPaymentsRaffles.map(p => (
              <div key={`${p.raffleId}-${p.number}`} className="glassmorphism p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Número {String(p.number).padStart(3, '0')} - Sorteo: {p.raffleDescription}</p>
                  <p className="text-sm text-slate-400">Comprador: {p.buyer?.name} ({p.buyer?.phone}) - {p.buyer?.paymentMethod}</p>
                </div>
                <button onClick={() => handleConfirmPayment(p.raffleId, p.number as number)} className="px-3 py-1 text-sm rounded bg-green-500">Confirmar</button>
              </div>
            )) : <p>No hay pagos pendientes en sorteos regulares.</p>}
          </div>

          <h2 className="text-xl font-poppins font-bold my-4 pt-4 border-t border-slate-700">Pagos Pendientes del Bolso Millonario</h2>
          <div className="space-y-3">
            {pendingPaymentsMillionBag.length > 0 ? pendingPaymentsMillionBag.map(p => (
              <div key={p.number} className="glassmorphism p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Número {p.number}</p>
                  <p className="text-sm text-slate-400">Comprador: {p.buyer?.name} ({p.buyer?.phone})</p>
                  <p className="text-xs text-slate-500">Pago Móvil: {p.buyer?.pagoMovilPhone} / CI: {p.buyer?.ci} / Ref: {p.buyer?.reference}</p>
                </div>
                <button onClick={() => handleConfirmMillionBagPayment(p.number as string)} className="px-3 py-1 text-sm rounded bg-green-500">Confirmar</button>
              </div>
            )) : <p>No hay pagos pendientes en el Bolso Millonario.</p>}
          </div>
        </div>
      )}

      {view === 'finance' && (
        <div>
          <h2 className="text-xl font-poppins font-bold mb-4">Dashboard Financiero (Sorteos Regulares)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glassmorphism p-6 rounded-lg">
              <p className="text-sm text-slate-400">Ingresos Totales</p>
              <p className="text-3xl font-bold text-cyan-400 neon-accent">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="glassmorphism p-6 rounded-lg">
              <p className="text-sm text-slate-400">Comisión (3%)</p>
              <p className="text-3xl font-bold text-fuchsia-400 neon-highlight">${totalCommission.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;