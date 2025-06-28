
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RaffleSection from './components/RaffleSection';
import AdminLoginSection from './components/AdminLoginSection';
import FloatingActions from './components/FloatingActions';
import Footer from './components/Footer';
import TermsModal from './components/TermsModal';
import { MainDrawSlotMachine } from './components/MainDrawSlotMachine'; 
import AdminDashboard from './components/AdminDashboard';
import VerifyTicketScreen from './components/VerifyTicketScreen';
import ClaimsScreen from './components/ClaimsScreen';
import SponsorTicker from './components/SponsorTicker';
import type { PublicView, AdminAccount, RaffleItem, TicketRegistration, UUID, MockUser, PaymentStatus } from './types';
import { initialRaffleItemsData } from './components/RaffleSectionData';
import { mockUsers } from './components/UserMockData'; 
import { initialAdminAccountsData } from './components/AdminAccountData';

const RAFFLE_END_DATE_KEY = 'pukatuRaffleEndDate';
const WINNING_NUMBER_KEY = 'pukatuWinningNumber';
const WINNER_NAME_KEY = 'pukatuWinnerName';
const IS_MAIN_RAFFLE_CHECKED_KEY = 'pukatuIsMainRaffleChecked';
const CURRENT_ADMIN_KEY = 'pukatuCurrentAdmin'; 
const RAFFLE_ITEMS_KEY = 'pukatuRaffleItems';
const SPONSOR_MESSAGE_KEY = 'pukatuSponsorMessage';
const SPONSOR_WHATSAPP_KEY = 'pukatuSponsorWhatsApp';
const MAIN_WHATSAPP_GROUP_URL_KEY = 'pukatuMainWhatsAppGroupUrl';
const TICKET_REGISTRATIONS_KEY = 'pukatuTicketRegistrations';
const ALL_ADMIN_ACCOUNTS_KEY = 'pukatuAllAdminAccounts';


const App: React.FC = () => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    const storedAdmin = localStorage.getItem(CURRENT_ADMIN_KEY);
    try {
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch (error) {
      console.error("Error parsing stored admin data:", error);
      return null;
    }
  });

  const [allAdminAccounts, setAllAdminAccounts] = useState<AdminAccount[]>(() => {
    const storedAdmins = localStorage.getItem(ALL_ADMIN_ACCOUNTS_KEY);
    try {
      return storedAdmins ? JSON.parse(storedAdmins) : initialAdminAccountsData;
    } catch (error) {
      console.error("Error parsing stored admin accounts:", error);
      return initialAdminAccountsData;
    }
  });

  const [currentPublicView, setCurrentPublicView] = useState<PublicView>('home');
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [raffleItems, setRaffleItems] = useState<RaffleItem[]>(() => {
    const storedRaffleItems = localStorage.getItem(RAFFLE_ITEMS_KEY);
    try {
        let items: RaffleItem[] = storedRaffleItems ? JSON.parse(storedRaffleItems) : initialRaffleItemsData;
        items = items.map(item => ({ ...item, raffleType: 'grid' as 'grid' })); 
        return items;
    } catch (error) {
        console.error("Error parsing stored raffle items:", error);
        return initialRaffleItemsData.map(item => ({ ...item, raffleType: 'grid' as 'grid' }));
    }
  });

  const [ticketRegistrations, setTicketRegistrations] = useState<TicketRegistration[]>(() => {
    const storedRegistrations = localStorage.getItem(TICKET_REGISTRATIONS_KEY);
    try {
      return storedRegistrations ? JSON.parse(storedRegistrations) : [];
    } catch (error) {
      console.error("Error parsing stored ticket registrations:", error);
      return [];
    }
  });

  const [raffleEndDate, setRaffleEndDate] = useState<string | null>(() => localStorage.getItem(RAFFLE_END_DATE_KEY));
  const [winningNumber, setWinningNumber] = useState<string | null>(() => localStorage.getItem(WINNING_NUMBER_KEY));
  const [winnerName, setWinnerName] = useState<string | null>(() => localStorage.getItem(WINNER_NAME_KEY));
  const [isMainRaffleChecked, setIsMainRaffleChecked] = useState<boolean>(() => localStorage.getItem(IS_MAIN_RAFFLE_CHECKED_KEY) === 'true');

  const [sponsorMessage, setSponsorMessage] = useState<string>(() => localStorage.getItem(SPONSOR_MESSAGE_KEY) || "¡Publicita con Nosotros! Haz clic aquí.");
  const [sponsorWhatsAppNumber, setSponsorWhatsAppNumber] = useState<string>(() => localStorage.getItem(SPONSOR_WHATSAPP_KEY) || "584120000000");

  const [mainWhatsAppGroupUrl, setMainWhatsAppGroupUrl] = useState<string>(() => localStorage.getItem(MAIN_WHATSAPP_GROUP_URL_KEY) || "https://chat.whatsapp.com/YOUR_GROUP_ID_HERE");


  useEffect(() => {
    // Ensure all items consistently have raffleType: 'grid' before saving
    const itemsToSave = raffleItems.map(item => ({...item, raffleType: 'grid' as 'grid'}));
    localStorage.setItem(RAFFLE_ITEMS_KEY, JSON.stringify(itemsToSave));
  }, [raffleItems]);

  useEffect(() => {
    localStorage.setItem(ALL_ADMIN_ACCOUNTS_KEY, JSON.stringify(allAdminAccounts));
  }, [allAdminAccounts]);

  useEffect(() => {
    localStorage.setItem(TICKET_REGISTRATIONS_KEY, JSON.stringify(ticketRegistrations));
  }, [ticketRegistrations]);

  useEffect(() => {
    if (raffleEndDate) localStorage.setItem(RAFFLE_END_DATE_KEY, raffleEndDate);
    else localStorage.removeItem(RAFFLE_END_DATE_KEY);
  }, [raffleEndDate]);

  useEffect(() => {
    if (winningNumber) localStorage.setItem(WINNING_NUMBER_KEY, winningNumber);
    else localStorage.removeItem(WINNING_NUMBER_KEY);
  }, [winningNumber]);

  useEffect(() => {
    if (winnerName) localStorage.setItem(WINNER_NAME_KEY, winnerName);
    else localStorage.removeItem(WINNER_NAME_KEY);
  }, [winnerName]);
  
  useEffect(() => {
    localStorage.setItem(IS_MAIN_RAFFLE_CHECKED_KEY, String(isMainRaffleChecked));
  }, [isMainRaffleChecked]);

  useEffect(() => {
    localStorage.setItem(SPONSOR_MESSAGE_KEY, sponsorMessage);
  }, [sponsorMessage]);

  useEffect(() => {
    localStorage.setItem(SPONSOR_WHATSAPP_KEY, sponsorWhatsAppNumber);
  }, [sponsorWhatsAppNumber]);

  useEffect(() => {
    localStorage.setItem(MAIN_WHATSAPP_GROUP_URL_KEY, mainWhatsAppGroupUrl);
  }, [mainWhatsAppGroupUrl]);

  const handleMainDrawWinnerDetermined = useCallback((newWinningNumber: string, foundWinnerName: string | null) => {
    setWinningNumber(newWinningNumber);
    setWinnerName(foundWinnerName);
    setIsMainRaffleChecked(true);
    console.log(`Main winning number: ${newWinningNumber}, Winner: ${foundWinnerName || 'No ticket sold for this number'}`);
  }, []);


  const handleLoginSuccess = useCallback((admin: AdminAccount) => {
    setCurrentAdmin(admin);
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(admin));
    setCurrentPublicView('home'); 
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentAdmin(null);
    localStorage.removeItem(CURRENT_ADMIN_KEY);
    setCurrentPublicView('home');
  }, []);

  const navigateToHome = () => setCurrentPublicView('home');
  const navigateToAdminLoginScreen = () => {
    if (!currentAdmin) setCurrentPublicView('adminLogin');
  };
  const navigateToVerifyTicketScreen = () => setCurrentPublicView('verifyTicket');
  const navigateToClaimsScreen = () => setCurrentPublicView('claims');

  const handleSetRaffleEndDate = useCallback((date: string | null) => {
    setRaffleEndDate(date);
    if (!date) { 
        setWinningNumber(null);
        setWinnerName(null);
        setIsMainRaffleChecked(false);
    }
  }, []);

  const handleClearWinner = useCallback(() => { 
    setWinningNumber(null);
    setWinnerName(null);
    setIsMainRaffleChecked(false); 
  }, []);

  const handleAddRaffleItem = useCallback((newItem: RaffleItem) => {
    setRaffleItems(prevItems => [...prevItems, {...newItem, raffleType: 'grid'} as RaffleItem]);
  }, []);

  const handleUpdateRaffleItem = useCallback((updatedItem: RaffleItem) => {
    setRaffleItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? ({...updatedItem, raffleType: 'grid'} as RaffleItem) : item))
    );
  }, []);

  const handleDeleteRaffleItem = useCallback((itemId: UUID) => {
    setRaffleItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const handleGridCardDrawCompleted = useCallback((raffleId: UUID, gridWinningNum: string) => {
    setRaffleItems(prevItems =>
      prevItems.map(item =>
        item.id === raffleId
          ? { ...item, raffleType: 'grid', gridCardWinningNumber: gridWinningNum, isGridCardDrawComplete: true } as RaffleItem
          : item
      )
    );
    console.log(`Grid card draw for ${raffleId} completed. Winning number: ${gridWinningNum}`);
  }, []);


  const handleUpdateSponsorTicker = useCallback((newMessage: string, newNumber: string) => {
    setSponsorMessage(newMessage);
    setSponsorWhatsAppNumber(newNumber);
  }, []);

  const handleUpdateMainWhatsAppGroupUrl = useCallback((newUrl: string) => {
    setMainWhatsAppGroupUrl(newUrl);
  }, []);

  const handleAddTicketRegistration = useCallback((registration: TicketRegistration) => {
    setTicketRegistrations(prevRegistrations => [...prevRegistrations, registration]);
    // No direct update to item.soldNumbers here; ClashCard will use pending status.
  }, []);
  
  const handleUpdateTicketRegistration = useCallback((updatedRegistration: TicketRegistration) => {
    let oldStatus: PaymentStatus | undefined = undefined;
    
    setTicketRegistrations(prevRegistrations => {
      const oldReg = prevRegistrations.find(r => r.id === updatedRegistration.id);
      if (oldReg) {
        oldStatus = oldReg.paymentStatus;
      }
      return prevRegistrations.map(reg => (reg.id === updatedRegistration.id ? updatedRegistration : reg));
    });
  
    // If status changed, update soldNumbers in the RaffleItem
    if (oldStatus && oldStatus !== updatedRegistration.paymentStatus) {
      const ticketNumbersInvolved = updatedRegistration.ticketNumber
        .split(',')
        .map(n => parseInt(n.trim(), 10))
        .filter(n => !isNaN(n));
  
      if (ticketNumbersInvolved.length > 0) {
        setRaffleItems(prevItems =>
          prevItems.map(item => {
            if (item.id === updatedRegistration.raffleId) {
              let currentSoldNumbersSet = new Set(item.soldNumbers || []);
              if (updatedRegistration.paymentStatus === 'Validado') {
                ticketNumbersInvolved.forEach(num => currentSoldNumbersSet.add(num));
              } else if (updatedRegistration.paymentStatus === 'Rechazado') {
                // Remove if it was 'Pendiente' or 'Validado' and now 'Rechazado'
                 if (oldStatus === 'Pendiente' || oldStatus === 'Validado') {
                    ticketNumbersInvolved.forEach(num => currentSoldNumbersSet.delete(num));
                 }
              }
              const updatedSoldNumbersArray = Array.from(currentSoldNumbersSet).sort((a,b) => a-b);
              return { ...item, soldNumbers: updatedSoldNumbersArray.length > 0 ? updatedSoldNumbersArray : undefined };
            }
            return item;
          })
        );
      }
    }
  }, [setTicketRegistrations, setRaffleItems]);

  const handleDeleteTicketRegistration = useCallback((registrationId: UUID) => {
    const registrationToDelete = ticketRegistrations.find(reg => reg.id === registrationId);
  
    setTicketRegistrations(prevRegistrations => prevRegistrations.filter(reg => reg.id !== registrationId));
  
    if (registrationToDelete) {
      // Remove numbers from soldNumbers if the deleted registration was 'Validado' or ('Pendiente' - as it was contributing to the green color)
      if (registrationToDelete.paymentStatus === 'Validado' || registrationToDelete.paymentStatus === 'Pendiente') {
        const ticketNumbersInvolved = registrationToDelete.ticketNumber
          .split(',')
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n));
        
        if (ticketNumbersInvolved.length > 0) {
          setRaffleItems(prevItems =>
            prevItems.map(item => {
              if (item.id === registrationToDelete.raffleId) {
                const currentSoldNumbersSet = new Set(item.soldNumbers || []);
                ticketNumbersInvolved.forEach(num => currentSoldNumbersSet.delete(num));
                const updatedSoldNumbersArray = Array.from(currentSoldNumbersSet).sort((a,b)=>a-b);
                return { ...item, soldNumbers: updatedSoldNumbersArray.length > 0 ? updatedSoldNumbersArray : undefined };
              }
              return item;
            })
          );
        }
      }
    }
  }, [ticketRegistrations, setTicketRegistrations, setRaffleItems]);


  const handleAddAdminAccount = useCallback((newAdmin: AdminAccount) => {
    setAllAdminAccounts(prevAdmins => [...prevAdmins, newAdmin]);
  }, []);

  const handleUpdateAdminAccount = useCallback((updatedAdmin: AdminAccount) => {
    setAllAdminAccounts(prevAdmins =>
      prevAdmins.map(admin => (admin.id === updatedAdmin.id ? updatedAdmin : admin))
    );
    if (currentAdmin?.id === updatedAdmin.id) {
      const newCurrentAdminData = { ...currentAdmin, ...updatedAdmin };
      if (!updatedAdmin.password && currentAdmin.password) { 
        newCurrentAdminData.password = currentAdmin.password; 
      }
      setCurrentAdmin(newCurrentAdminData);
      localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(newCurrentAdminData));
    }
  }, [currentAdmin]);

  const handleDeleteAdminAccount = useCallback((adminId: UUID) => {
    setAllAdminAccounts(prevAdmins => prevAdmins.filter(admin => admin.id !== adminId));
    if (currentAdmin?.id === adminId) {
        handleLogout();
    }
  }, [currentAdmin, handleLogout]);


  if (currentAdmin) {
    return (
      <AdminDashboard
        admin={currentAdmin}
        allAdminAccounts={allAdminAccounts}
        currentRaffleEndDate={raffleEndDate}
        onSetRaffleEndDate={handleSetRaffleEndDate}
        currentWinningNumber={winningNumber} 
        onClearWinner={handleClearWinner}
        onLogout={handleLogout}
        raffleItems={raffleItems} 
        onAddRaffleItem={handleAddRaffleItem}
        onUpdateRaffleItem={handleUpdateRaffleItem}
        onDeleteRaffleItem={handleDeleteRaffleItem}
        currentSponsorMessage={sponsorMessage}
        currentSponsorWhatsApp={sponsorWhatsAppNumber}
        onUpdateSponsorTicker={handleUpdateSponsorTicker}
        currentMainWhatsAppGroupUrl={mainWhatsAppGroupUrl}
        onUpdateMainWhatsAppGroupUrl={handleUpdateMainWhatsAppGroupUrl}
        ticketRegistrations={ticketRegistrations}
        onAddAdminAccount={handleAddAdminAccount}
        onUpdateAdminAccount={handleUpdateAdminAccount}
        onDeleteAdminAccount={handleDeleteAdminAccount}
        onUpdateTicketRegistration={handleUpdateTicketRegistration}
        onDeleteTicketRegistration={handleDeleteTicketRegistration}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-['Montserrat'] flex flex-col">
      <div className="text-center py-4 bg-[#1a1a1a]">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-300">
          Gran Sorteo
          <span className="block font-['Orbitron'] text-5xl sm:text-7xl font-bold text-[#f7ca18] tracking-wider mt-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
            PUKATU
          </span>
        </h1>
      </div>
      <Header
        onNavigateHome={navigateToHome}
        onNavigateToAdminLoginScreen={navigateToAdminLoginScreen}
        onNavigateToVerifyTicketScreen={navigateToVerifyTicketScreen}
        onNavigateToClaimsScreen={navigateToClaimsScreen}
      />
      
      <main className="container mx-auto mt-3 px-4 flex-grow">
        {currentPublicView === 'home' && (
          <MainDrawSlotMachine
            targetDate={raffleEndDate}
            currentWinningNumber={winningNumber}
            currentWinnerName={winnerName}
            isMainRaffleChecked={isMainRaffleChecked}
            onDetermineWinner={handleMainDrawWinnerDetermined}
            onAcknowledgeWinner={handleClearWinner} 
            mockUsers={mockUsers}
          />
        )}

        {currentPublicView === 'home' && (
          <>
            <SponsorTicker 
              message={sponsorMessage}
              whatsAppNumber={sponsorWhatsAppNumber}
            />
            <RaffleSection 
                raffleItems={raffleItems} 
                ticketRegistrations={ticketRegistrations} // Pass ticketRegistrations
                onNavigateToVerifyTicketScreen={navigateToVerifyTicketScreen} 
                onAddTicketRegistration={handleAddTicketRegistration}
                onGridCardDrawCompleted={handleGridCardDrawCompleted} 
            />
          </>
        )}
        {currentPublicView === 'adminLogin' && (
          <AdminLoginSection adminAccounts={allAdminAccounts} onLoginSuccess={handleLoginSuccess} />
        )}
        {currentPublicView === 'verifyTicket' && (
          <VerifyTicketScreen raffleItems={raffleItems} />
        )}
        {currentPublicView === 'claims' && (
          <ClaimsScreen />
        )}
      </main>
      
      <FloatingActions 
        onNavigateToClaimsScreen={navigateToClaimsScreen} 
        mainWhatsAppGroupUrl={mainWhatsAppGroupUrl}
      />
      <Footer onShowTerms={() => setShowTermsModal(true)} />
      <TermsModal show={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
};

export default App;
