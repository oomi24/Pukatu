import React, { useState, useEffect, useCallback } from 'react';
import AdminPanelSection from './AdminPanelSection';
import EditRaffleModal from './EditRaffleModal';
import AddRaffleModal from './AddRaffleModal';
import AddAdminModal from './AddAdminModal';
import EditAdminModal from './EditAdminModal';
import EditTicketRegistrationModal from './EditTicketRegistrationModal';
import type { AdminAccount, RaffleItem, TicketRegistration, UUID, PaymentStatus } from '../types';
import StarIcon from './icons/StarIcon';
import { TrashIcon, UserPlusIcon, PlusCircleIcon, PencilIcon, UserMinusIcon } from './icons/ActionIcons';
import Button from './ui/Button';

interface AdminDashboardProps {
  admin: AdminAccount;
  allAdminAccounts: AdminAccount[];
  currentRaffleEndDate: string | null;
  onSetRaffleEndDate: (date: string | null) => void;
  currentWinningNumber: string | null;
  onClearWinner: () => void;
  onLogout: () => void;
  raffleItems: RaffleItem[];
  onAddRaffleItem: (newItem: RaffleItem) => void;
  onUpdateRaffleItem: (updatedItem: RaffleItem) => void;
  onDeleteRaffleItem: (itemId: UUID) => void;
  currentSponsorMessage: string;
  currentSponsorWhatsApp: string;
  onUpdateSponsorTicker: (message: string, whatsappNumber: string) => void;
  currentMainWhatsAppGroupUrl: string;
  onUpdateMainWhatsAppGroupUrl: (url: string) => void;
  ticketRegistrations: TicketRegistration[];
  onAddAdminAccount: (newAdmin: AdminAccount) => void;
  onUpdateAdminAccount: (updatedAdmin: AdminAccount) => void;
  onDeleteAdminAccount: (adminId: UUID) => void;
  onUpdateTicketRegistration: (updatedRegistration: TicketRegistration) => void; 
  onDeleteTicketRegistration: (registrationId: UUID) => void; 
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  allAdminAccounts,
  currentRaffleEndDate,
  onSetRaffleEndDate,
  currentWinningNumber,
  onClearWinner,
  onLogout,
  raffleItems,
  onAddRaffleItem,
  onUpdateRaffleItem,
  onDeleteRaffleItem,
  currentSponsorMessage,
  currentSponsorWhatsApp,
  onUpdateSponsorTicker,
  currentMainWhatsAppGroupUrl,
  onUpdateMainWhatsAppGroupUrl,
  ticketRegistrations,
  onAddAdminAccount,
  onUpdateAdminAccount,
  onDeleteAdminAccount,
  onUpdateTicketRegistration,
  onDeleteTicketRegistration,
}) => {
  const [editingRaffle, setEditingRaffle] = useState<RaffleItem | null>(null);
  const [showingAddRaffleModal, setShowingAddRaffleModal] = useState(false);
  const [showingAddAdminModal, setShowingAddAdminModal] = useState(false);
  const [editingAdminAccount, setEditingAdminAccount] = useState<AdminAccount | null>(null);
  const [editingTicketRegistration, setEditingTicketRegistration] = useState<TicketRegistration | null>(null); 

  const [sponsorMessageInput, setSponsorMessageInput] = useState(currentSponsorMessage);
  const [sponsorWhatsAppInput, setSponsorWhatsAppInput] = useState(currentSponsorWhatsApp);
  const [mainWhatsAppGroupUrlInput, setMainWhatsAppGroupUrlInput] = useState(currentMainWhatsAppGroupUrl);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isRobleAdmin = admin.id === 'roble';

  useEffect(() => {
    setSponsorMessageInput(currentSponsorMessage);
  }, [currentSponsorMessage]);

  useEffect(() => {
    setSponsorWhatsAppInput(currentSponsorWhatsApp);
  }, [currentSponsorWhatsApp]);

  useEffect(() => {
    setMainWhatsAppGroupUrlInput(currentMainWhatsAppGroupUrl);
  }, [currentMainWhatsAppGroupUrl]);


  const managedRaffles = raffleItems.filter(
    (raffle) => raffle.administratorWhatsApp === admin.whatsAppNumber || raffle.managedByAdminId === admin.id
  );

  const displayRaffles = isRobleAdmin ? raffleItems : managedRaffles;

  const adminTicketRegistrations = ticketRegistrations.filter(
    (reg) => reg.managedByAdminId === admin.id
  );

  const handleEditRaffle = (raffle: RaffleItem) => {
    setEditingRaffle(raffle);
  };
  
  const handleOpenEditAdminModal = (account: AdminAccount) => {
    setEditingAdminAccount(account);
  };

  const handleOpenEditTicketRegistrationModal = (registration: TicketRegistration) => {
    setEditingTicketRegistration(registration);
  };

  const handleCloseModal = () => {
    setEditingRaffle(null);
    setShowingAddRaffleModal(false);
    setShowingAddAdminModal(false);
    setEditingAdminAccount(null);
    setEditingTicketRegistration(null); 
  };

  const handleSaveRaffleChanges = (updatedRaffle: RaffleItem) => {
    onUpdateRaffleItem(updatedRaffle);
    handleCloseModal();
    showSaveMessage("Cambios en el sorteo guardados.");
  };

  const handleAddNewRaffle = (newRaffle: RaffleItem) => {
    onAddRaffleItem(newRaffle);
    handleCloseModal();
    showSaveMessage("Nuevo sorteo agregado exitosamente.");
  };

  const handleDeleteRaffle = (itemId: UUID) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este sorteo? Esta acción no se puede deshacer.")) {
        onDeleteRaffleItem(itemId);
        showSaveMessage("Sorteo eliminado.");
    }
  };

  const handleAddNewAdmin = (newAdmin: AdminAccount) => {
    onAddAdminAccount(newAdmin);
    handleCloseModal();
    showSaveMessage(`Administrador ${newAdmin.username} agregado.`);
  };
  
  const handleUpdateExistingAdmin = (updatedAdmin: AdminAccount) => {
    onUpdateAdminAccount(updatedAdmin);
    handleCloseModal();
    showSaveMessage(`Datos del administrador ${updatedAdmin.displayName} actualizados.`);
  };

  const handleDeleteAdmin = (adminId: UUID, adminName: string) => {
     if (adminId === admin.id) {
        alert("No puedes eliminar tu propia cuenta de administrador.");
        return;
    }
    if (adminId === 'roble') { 
        alert("La cuenta principal 'Roble' no puede ser eliminada.");
        return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar al administrador ${adminName}? Esta acción no se puede deshacer.`)) {
        onDeleteAdminAccount(adminId);
        showSaveMessage(`Administrador ${adminName} eliminado.`);
    }
  };
  
  const handleSaveTicketRegistrationChanges = (updatedRegistration: TicketRegistration) => {
    onUpdateTicketRegistration(updatedRegistration);
    handleCloseModal();
    showSaveMessage("Registro de ticket actualizado.");
  };

  const handleDeleteTicketRegistrationClick = (registrationId: UUID, participantName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el registro de ticket para ${participantName} (ID: ${registrationId})? Esta acción no se puede deshacer.`)) {
      onDeleteTicketRegistration(registrationId);
      showSaveMessage("Registro de ticket eliminado.");
    }
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return 'No especificado';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleSaveSponsorTicker = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSponsorTicker(sponsorMessageInput, sponsorWhatsAppInput);
    showSaveMessage("Cintillo publicitario actualizado.");
  };

  const handleSaveMainWhatsAppGroupUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMainWhatsAppGroupUrl(mainWhatsAppGroupUrlInput);
    showSaveMessage("Enlace del grupo de WhatsApp actualizado.");
  };

  const getAdminDisplayName = useCallback((adminId: UUID | undefined): string => {
    if (!adminId) return 'N/A';
    const adminAccount = allAdminAccounts.find(acc => acc.id === adminId);
    return adminAccount ? adminAccount.displayName : `ID: ${adminId}`;
  }, [allAdminAccounts]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Validado': return 'bg-green-500 text-white';
      case 'Pendiente': return 'bg-yellow-500 text-black';
      case 'Rechazado': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const inputClasses = "w-full px-3 py-2.5 bg-[#1a1a1a] text-white border border-gray-600 focus:border-[#f7ca18] focus:outline-none focus:ring-1 focus:ring-[#f7ca18] rounded-md placeholder-gray-500 text-sm";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1";
  const sectionClasses = "w-full md:max-w-2xl lg:max-w-4xl bg-[#2a1d5e]/70 p-6 sm:p-8 rounded-lg shadow-xl"; 
  const titleClasses = "text-2xl font-['Orbitron'] text-center text-[#f7ca18] mb-6";
  const buttonClasses = "w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400";


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#12082e] to-[#1e1442] text-white font-['Montserrat'] flex flex-col items-center p-4 sm:p-6">
        <header className="w-full max-w-6xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-purple-300">¡Bienvenido, {admin.displayName || admin.username}! {isRobleAdmin && <span className="text-yellow-400">(Super Admin)</span>}</p>
            <h1 className="text-2xl sm:text-3xl font-['Orbitron'] text-[#f7ca18] mt-1">
              Panel de Administración Pukatu
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            Cerrar Sesión
          </button>
        </header>

        {saveMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-[150] text-sm">
                {saveMessage}
            </div>
        )}

        <main className="w-full flex-grow flex flex-col items-center gap-8">
          <div className="w-full md:max-w-2xl lg:max-w-3xl"> 
            <h2 className="text-2xl font-['Orbitron'] text-center text-purple-300 mb-4">Ajustes Globales del Sorteo Principal</h2>
            <AdminPanelSection
              currentRaffleEndDate={currentRaffleEndDate}
              onSetRaffleEndDate={onSetRaffleEndDate}
              currentWinningNumber={currentWinningNumber}
              onClearWinner={onClearWinner}
            />
          </div>
          
          <div className={`${sectionClasses} md:max-w-2xl lg:max-w-3xl`}> 
            <h2 className={titleClasses}>Gestionar Cintillo Publicitario</h2>
            <form onSubmit={handleSaveSponsorTicker} className="space-y-4">
              <div>
                <label htmlFor="sponsorMessage" className={labelClasses}>Mensaje del Cintillo:</label>
                <input type="text" id="sponsorMessage" value={sponsorMessageInput} onChange={(e) => setSponsorMessageInput(e.target.value)} className={inputClasses} placeholder="Ej: ¡Publicita con Nosotros!" required />
              </div>
              <div>
                <label htmlFor="sponsorWhatsApp" className={labelClasses}>Número WhatsApp del Patrocinador (Ej: 584121234567):</label>
                <input type="tel" id="sponsorWhatsApp" value={sponsorWhatsAppInput} onChange={(e) => setSponsorWhatsAppInput(e.target.value)} className={inputClasses} placeholder="584121234567" pattern="^\d+$" title="Solo números, ej: 584121234567" required />
              </div>
              <button type="submit" className={buttonClasses}>Actualizar Cintillo</button>
            </form>
          </div>
          
          <div className={`${sectionClasses} md:max-w-2xl lg:max-w-3xl`}> 
            <h2 className={titleClasses}>Gestionar Enlace Principal de WhatsApp</h2>
            <form onSubmit={handleSaveMainWhatsAppGroupUrl} className="space-y-4">
              <div>
                <label htmlFor="mainWhatsAppGroupUrl" className={labelClasses}>URL del Grupo Principal de WhatsApp:</label>
                <input type="url" id="mainWhatsAppGroupUrl" value={mainWhatsAppGroupUrlInput} onChange={(e) => setMainWhatsAppGroupUrlInput(e.target.value)} className={inputClasses} placeholder="https://chat.whatsapp.com/..." required />
              </div>
              <button type="submit" className={buttonClasses}>Actualizar Enlace del Grupo</button>
            </form>
          </div>

          <section className={sectionClasses}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-['Orbitron'] text-[#f7ca18]">
                {isRobleAdmin ? "Gestionar Todos los Sorteos" : "Mis Sorteos Gestionados"}
              </h2>
              <Button 
                onClick={() => setShowingAddRaffleModal(true)} 
                variant="primary" 
                size="md"
                icon={<PlusCircleIcon className="w-5 h-5" />}
              >
                Añadir Sorteo
              </Button>
            </div>
            {displayRaffles.length > 0 ? (
              <div className="overflow-x-auto bg-black/20 p-2 sm:p-4 rounded-md">
                <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 tracking-wider">Premio</th>
                      <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 tracking-wider">Fecha Límite</th>
                      <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 tracking-wider">Tickets</th>
                      <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 tracking-wider">Costo</th>
                      <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 tracking-wider">Dest.</th>
                      <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#2a1d5e]/30 divide-y divide-gray-600">
                    {displayRaffles.map((raffle) => (
                      <tr key={raffle.id} className="hover:bg-purple-900/30 transition-colors">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={raffle.imageUrl} alt={raffle.raffleTitle || 'Sorteo'} className="w-10 h-10 object-cover rounded-md mr-2 sm:mr-3 shadow-md" />
                            <div>
                                <div className="font-semibold text-white">{truncateText(raffle.raffleTitle, 25)}</div>
                                <div className="text-gray-400 text-[10px] sm:text-xs">ID: {raffle.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-gray-300">
                          {raffle.targetDate ? new Date(raffle.targetDate).toLocaleDateString('es-VE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No definida'}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-gray-300">{raffle.gridNumbersTotal}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-gray-300">${raffle.ticketCost?.toFixed(2)}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          {raffle.isFeatured ? <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" filled /> : <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" filled={false}/>}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right">
                          <button onClick={() => handleEditRaffle(raffle)} className="text-blue-400 hover:text-blue-300 p-1 sm:p-1.5" title="Editar Sorteo">
                            <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button onClick={() => handleDeleteRaffle(raffle.id)} className="text-red-400 hover:text-red-300 p-1 sm:p-1.5 ml-1 sm:ml-2" title="Eliminar Sorteo">
                            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-6">No hay sorteos para mostrar.</p>
            )}
          </section>

          <section className={sectionClasses}>
            <h2 className={titleClasses}>Mis Registros de Tickets Procesados</h2>
            {adminTicketRegistrations.length > 0 ? (
              <div className="overflow-x-auto bg-black/20 p-2 sm:p-4 rounded-md">
                <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm">
                   <thead className="bg-gray-800/50">
                        <tr>
                            <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Sorteo</th>
                            <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Participante</th>
                            <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Ticket</th>
                            <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Fecha Reg.</th>
                            <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Pago</th>
                            <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#2a1d5e]/30 divide-y divide-gray-600">
                        {adminTicketRegistrations.map((reg) => (
                            <tr key={reg.id} className="hover:bg-purple-900/30">
                                <td className="px-3 py-3 whitespace-nowrap text-white">{truncateText(reg.raffleName, 20)}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-gray-300">{truncateText(reg.participantName, 20)}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-[#f7ca18] font-mono">{reg.ticketNumber}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-gray-400">{new Date(reg.registrationDate).toLocaleDateString('es-VE')}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-gray-300" title={reg.paymentReference}>{reg.paymentMethod}</td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reg.paymentStatus)}`}>
                                        {reg.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-6">Aún no has procesado ningún registro de tickets.</p>
            )}
          </section>
          
          {isRobleAdmin && (
            <>
            <section className={sectionClasses}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-['Orbitron'] text-[#f7ca18]">Gestionar Cuentas de Administrador</h2>
                <Button 
                    onClick={() => setShowingAddAdminModal(true)} 
                    variant="primary" 
                    size="md"
                    icon={<UserPlusIcon className="w-5 h-5"/>}
                >
                  Añadir Admin
                </Button>
              </div>
              {allAdminAccounts.length > 0 ? (
                <div className="overflow-x-auto bg-black/20 p-2 sm:p-4 rounded-md">
                  <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Nombre Visible</th>
                        <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">Usuario</th>
                        <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300">WhatsApp</th>
                        <th scope="col" className="px-3 py-3 text-left font-medium text-purple-300 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#2a1d5e]/30 divide-y divide-gray-600">
                      {allAdminAccounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-purple-900/30">
                          <td className="px-3 py-3 whitespace-nowrap text-white">{acc.displayName} {acc.id === admin.id && <span className="text-xs text-green-400">(Tú)</span>}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-gray-300">{acc.username}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-gray-300">{acc.whatsAppNumber || 'N/A'}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-right">
                            {acc.id !== admin.id && (
                                <button onClick={() => handleOpenEditAdminModal(acc)} className="text-blue-400 hover:text-blue-300 p-1 sm:p-1.5" title={`Editar ${acc.displayName}`}>
                                    <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                            {acc.id !== admin.id && acc.id !== 'roble' && ( 
                                <button onClick={() => handleDeleteAdmin(acc.id, acc.displayName)} className="text-red-400 hover:text-red-300 p-1 sm:p-1.5 ml-1 sm:ml-2" title={`Eliminar ${acc.displayName}`}>
                                    <UserMinusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                 <p className="text-center text-gray-400 py-6">No hay cuentas de administrador para gestionar.</p>
              )}
            </section>

            <section className={`${sectionClasses} lg:max-w-5xl`}> {/* Wider table for global tickets */}
              <h2 className={titleClasses}>Gestión Global de Tickets Registrados</h2>
              {ticketRegistrations.length > 0 ? (
                <div className="overflow-x-auto bg-black/20 p-2 sm:p-4 rounded-md">
                  <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Sorteo</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Participante</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Ticket</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Método Pago</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Referencia</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Estado Pago</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300">Admin Gestor</th>
                        <th scope="col" className="px-2 py-3 text-left font-medium text-purple-300 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#2a1d5e]/30 divide-y divide-gray-600">
                      {ticketRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-purple-900/30">
                          <td className="px-2 py-3 whitespace-nowrap text-white" title={reg.raffleName}>{truncateText(reg.raffleName, 15)}</td>
                          <td className="px-2 py-3 whitespace-nowrap text-gray-300" title={reg.participantName}>
                            {truncateText(reg.participantName, 15)}
                            <div className="text-[10px] text-gray-500">{reg.participantWhatsApp}</div>
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-[#f7ca18] font-mono text-center">{reg.ticketNumber}</td>
                          <td className="px-2 py-3 whitespace-nowrap text-gray-300">{reg.paymentMethod}</td>
                          <td className="px-2 py-3 whitespace-nowrap text-gray-300" title={reg.paymentReference}>{truncateText(reg.paymentReference, 15)}</td>
                          <td className="px-2 py-3 whitespace-nowrap text-center">
                             <span className={`px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${getStatusColor(reg.paymentStatus)}`}>
                                {reg.paymentStatus}
                            </span>
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-gray-400" title={getAdminDisplayName(reg.managedByAdminId)}>
                            {truncateText(getAdminDisplayName(reg.managedByAdminId), 12)}
                            <div className="text-[10px] text-gray-500">Reg: {new Date(reg.registrationDate).toLocaleDateString('es-VE')}</div>
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-right">
                            <button onClick={() => handleOpenEditTicketRegistrationModal(reg)} className="text-blue-400 hover:text-blue-300 p-1" title={`Editar registro de ${reg.participantName}`}>
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTicketRegistrationClick(reg.id, reg.participantName)} className="text-red-400 hover:text-red-300 p-1 ml-1" title={`Eliminar registro de ${reg.participantName}`}>
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-6">No hay registros de tickets en el sistema.</p>
              )}
            </section>
            </>
          )}

        </main>
      </div>

      {editingRaffle && (
        <EditRaffleModal
          show={!!editingRaffle}
          onClose={handleCloseModal}
          raffleItem={editingRaffle}
          onSave={handleSaveRaffleChanges}
        />
      )}
      {showingAddRaffleModal && (
        <AddRaffleModal
          show={showingAddRaffleModal}
          onClose={handleCloseModal}
          onAdd={handleAddNewRaffle}
          adminId={admin.id} 
          adminWhatsApp={admin.whatsAppNumber}
        />
      )}
      {showingAddAdminModal && isRobleAdmin && (
        <AddAdminModal
          show={showingAddAdminModal}
          onClose={handleCloseModal}
          onAddAdmin={handleAddNewAdmin}
          existingUsernames={allAdminAccounts.map(a => a.username)}
        />
      )}
      {editingAdminAccount && isRobleAdmin && (
        <EditAdminModal
          show={!!editingAdminAccount}
          onClose={handleCloseModal}
          adminAccount={editingAdminAccount}
          onSave={handleUpdateExistingAdmin}
          existingUsernames={allAdminAccounts.map(a => a.username)}
        />
      )}
      {editingTicketRegistration && ( 
        <EditTicketRegistrationModal
          show={!!editingTicketRegistration}
          onClose={handleCloseModal}
          ticketRegistration={editingTicketRegistration}
          onSave={handleSaveTicketRegistrationChanges}
          isRobleAdmin={isRobleAdmin} // Pass isRobleAdmin prop
        />
      )}
    </>
  );
};

export default AdminDashboard;