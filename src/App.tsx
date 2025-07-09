import React, { useState, useEffect } from 'react';
import type { User, Raffle, Buyer, RaffleNumber, MillionBagNumber, PBRecord } from './core/types';
import { NumberStatus, PaymentMethod } from './core/types';
import Header from './components/Header';
import RaffleCard from './components/RaffleCard';
import RaffleView from './components/RaffleView';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import MillionBagCard from './components/MillionBagCard';
import MillionBagView from './components/MillionBagView';

const generateNumbers = (size: 100 | 1000): RaffleNumber[] => {
  return Array.from({ length: size }, (_, i) => ({
    number: i,
    status: NumberStatus.Available,
  }));
};

const generateMillionBagNumbers = (): MillionBagNumber[] => {
  return Array.from({ length: 1000 }, (_, i) => ({
    number: String(i).padStart(3, '0'),
    status: NumberStatus.Available,
  }));
};

const mockPBRecord = (): PBRecord => ({
    id: new Date().getTime().toString() + Math.random().toString(),
    collectionId: 'local',
    collectionName: 'local',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
});

const initialRaffles: Raffle[] = [
  {
    ...mockPBRecord(),
    id: '1',
    isMillionBag: false,
    prizeImage: 'https://picsum.photos/seed/tech/800/600',
    description: 'Kit Tecnológico de Última Generación',
    terms: 'El sorteo se realizará en la fecha indicada. El ganador será contactado vía WhatsApp.',
    size: 100,
    closeDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    numbers: generateNumbers(100),
    winningNumber: null,
    isActive: true,
  },
  {
    ...mockPBRecord(),
    id: '2',
    isMillionBag: false,
    prizeImage: 'https://picsum.photos/seed/car/800/600',
    description: 'Automóvil 0KM Modelo 2024',
    terms: 'El premio debe ser reclamado en un plazo de 30 días. Incluye gastos de registro.',
    size: 1000,
    closeDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    numbers: generateNumbers(1000),
    winningNumber: null,
    isActive: true,
  },
   {
    ...mockPBRecord(),
    id: '3',
    isMillionBag: false,
    prizeImage: 'https://picsum.photos/seed/vacation/800/600',
    description: 'Viaje al Caribe para 2 personas',
    terms: 'Sorteo finalizado. El ganador ya fue notificado.',
    size: 100,
    closeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    numbers: (() => {
        const nums = generateNumbers(100);
        nums[42].status = NumberStatus.Sold;
        nums[42].buyer = {name: 'Juan Perez', phone: '123456789', paymentMethod: PaymentMethod.Transfer };
        return nums;
    })(),
    winningNumber: 42,
    isActive: false,
  },
];

const initialMillionBag: Raffle = {
    ...mockPBRecord(),
    id: 'million-bag-1',
    isMillionBag: true,
    description: 'Bolso Millonario Pukatu',
    terms: 'El premio es el 60% de lo recaudado. Se sortea al vender todos los números o en la fecha de cierre, lo que ocurra primero.',
    size: 1000,
    isActive: true,
    closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    numbers: generateMillionBagNumbers(),
    winningNumber: null,
    drawConfig: {
        mode: 'hybrid',
        notifyThreshold: 80,
    }
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [millionBag, setMillionBag] = useState<Raffle>(initialMillionBag);
  const [view, setView] = useState<'home' | 'raffle' | 'admin' | 'millionBag'>('home');
  const [currentRaffleId, setCurrentRaffleId] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Load users or set initial admin
    const savedUsers = localStorage.getItem('pukatu_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const robleUser: User = { ...mockPBRecord(), id: 'roble-user', username: 'Roble', password: 'Apamate.25', role: 'superadmin', phone: '04120000000' };
      const adminUser: User = { ...mockPBRecord(), id: 'admin-user', username: 'AdminManager', password: 'password123', role: 'admin', phone: '04121112233' };
      const initialUsers = [robleUser, adminUser];
      setUsers(initialUsers);
      localStorage.setItem('pukatu_users', JSON.stringify(initialUsers));
    }
    
    // Load logged-in user session
    const savedUserSession = localStorage.getItem('pukatu_user_session');
    if (savedUserSession) setUser(JSON.parse(savedUserSession));

    // Load raffles and million bag
    const savedRaffles = localStorage.getItem('pukatu_raffles');
    setRaffles(savedRaffles ? JSON.parse(savedRaffles) : initialRaffles);
    
    const savedMillionBag = localStorage.getItem('pukatu_million_bag');
    if (savedMillionBag) {
        const parsedBag = JSON.parse(savedMillionBag);
        // Ensure drawConfig exists for backward compatibility
        if (!parsedBag.drawConfig) {
            parsedBag.drawConfig = initialMillionBag.drawConfig;
        }
        setMillionBag(parsedBag);
    } else {
        setMillionBag(initialMillionBag);
    }

  }, []);

  useEffect(() => {
    if (raffles.length > 0) {
      localStorage.setItem('pukatu_raffles', JSON.stringify(raffles));
    }
  }, [raffles]);

  useEffect(() => {
      localStorage.setItem('pukatu_million_bag', JSON.stringify(millionBag));
  }, [millionBag]);

  const handleLogin = (username: string, pass: string) => {
    const foundUser = users.find(u => u.username === username && u.password === pass);
    if (foundUser) {
      const userSession: User = { ...foundUser };
      delete userSession.password; // Never store password in session state
      
      setUser(userSession);
      localStorage.setItem('pukatu_user_session', JSON.stringify(userSession));
      setLoginModalOpen(false);
      setLoginError('');
      if(userSession.role === 'admin' || userSession.role === 'superadmin') {
        setView('admin');
      }
    } else {
      setLoginError('Usuario o clave incorrecta.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pukatu_user_session');
    setView('home');
  };

  const handleCreateUser = (newUser: User) => {
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        alert('Error: El nombre de usuario ya existe.');
        return;
    }
    const userToSave: User = {
        ...mockPBRecord(),
        ...newUser,
    };
    const updatedUsers = [...users, userToSave];
    setUsers(updatedUsers);
    localStorage.setItem('pukatu_users', JSON.stringify(updatedUsers));
    alert(`Usuario ${newUser.username} creado exitosamente.`);
  };

  const handleSelectRaffle = (raffleId: string) => {
    setCurrentRaffleId(raffleId);
    setView('raffle');
  };

  const handleUpdateRaffle = (updatedRaffle: Raffle) => {
    setRaffles(raffles.map(r => (r.id === updatedRaffle.id ? updatedRaffle : r)));
  };

  const handleDeleteRaffle = (raffleId: string) => {
    setRaffles(raffles.filter(r => r.id !== raffleId));
  };
  
  const handleUpdateMillionBag = (updatedMillionBag: Raffle) => {
    setMillionBag(updatedMillionBag);
  };

  const handleCreateRaffle = (newRaffleData: Pick<Raffle, 'description' | 'prizeImage' | 'terms' | 'size' | 'closeDate'>) => {
    const newRaffle: Raffle = {
        ...mockPBRecord(),
        ...newRaffleData,
        id: new Date().toISOString(),
        numbers: generateNumbers(newRaffleData.size),
        winningNumber: null,
        isActive: true,
        isMillionBag: false,
    };
    setRaffles([newRaffle, ...raffles]);
  };

  const currentRaffle = raffles.find(r => r.id === currentRaffleId);

  const renderContent = () => {
    switch (view) {
      case 'admin':
        return user && (user.role === 'admin' || user.role === 'superadmin') ? (
            <AdminDashboard 
                currentUser={user} 
                users={users}
                raffles={raffles} 
                millionBag={millionBag}
                onUpdateRaffle={handleUpdateRaffle} 
                onCreateRaffle={handleCreateRaffle} 
                onDeleteRaffle={handleDeleteRaffle}
                onUpdateMillionBag={handleUpdateMillionBag} 
                onCreateUser={handleCreateUser}
            />
        ) : <p>Acceso denegado.</p>;
      case 'raffle':
        return currentRaffle ? <RaffleView raffle={currentRaffle} onUpdateRaffle={handleUpdateRaffle} onBack={() => setView('home')} /> : <p>Sorteo no encontrado.</p>;
      case 'millionBag':
        return <MillionBagView millionBag={millionBag} onUpdateMillionBag={handleUpdateMillionBag} onBack={() => setView('home')} />;
      case 'home':
      default:
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {millionBag.isActive && <MillionBagCard millionBag={millionBag} onSelect={() => setView('millionBag')} />}

            <h1 className="text-4xl font-poppins font-extrabold text-center mb-2 mt-12">Sorteos Regulares</h1>
            <p className="text-center text-slate-400 mb-8">Elige tu sorteo y participa por premios increíbles.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {raffles.filter(r => r.isActive).map(raffle => (
                <RaffleCard key={raffle.id} raffle={raffle} onSelect={() => handleSelectRaffle(raffle.id)} />
              ))}
            </div>
             <h2 className="text-3xl font-poppins font-bold text-center mt-16 mb-8">Sorteos Finalizados</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {raffles.filter(r => !r.isActive).map(raffle => (
                <RaffleCard key={raffle.id} raffle={raffle} onSelect={() => handleSelectRaffle(raffle.id)} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header
        user={user}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        onAdminClick={() => setView('admin')}
        onHomeClick={() => setView('home')}
      />
      <main>{renderContent()}</main>
      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          error={loginError}
        />
      )}
    </div>
  );
};

export default App;