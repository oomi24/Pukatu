import type { RaffleItem } from '../types';

export const initialRaffleItemsData: RaffleItem[] = [
  {
    id: 'grid1',
    raffleType: 'grid', // Explicitly 'grid'
    name: 'Gran Rifa de Aniversario Pukatu', // Fallback name or internal reference
    imageUrl: 'https://picsum.photos/seed/gridpukatu/300/120', // Specific image for the grid card top
    ticketPurchaseLink: '#', 
    ticketCheckLink: '#', 
    date: '15/SEPTIEMBRE/2024', // Main display date for grid
    progressPercentage: 25, // Example progress
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Example target date
    administratorWhatsApp: '584120000000', 
    managedByAdminId: 'roble',
    ticketCost: 10,
    gridNumbersTotal: 100, // For a 10x10 grid
    gridStartNumber: 1,
    prizeDetails: [
      "1er. Premio: Carro 0KM",
      "2do. Premio: Moto de Alta Cilindrada",
      "3er. Premio: Viaje a Los Roques (Todo Incluido)"
    ],
    soldNumbers: [1, 5, 10, 15, 20, 25, 30, 35, 40, 42, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    raffleTitle: "GRAN RIFA PUKATU", // Main title for the grid card
    raffleSubtitle: "¡TU OPORTUNIDAD DE GANAR EN GRANDE!",
    callToAction: "¡COMPRA TU NÚMERO YA!",
    day: '15', // Derived from targetDate or for consistency
    month: 'Septiembre', // Derived from targetDate or for consistency
    isFeatured: true,
    description: "Participa en la rifa más grande del año y podrías llevarte premios increíbles. ¡No te quedes fuera!",
    conditions: "Sorteo válido a nivel nacional. Premios no transferibles. Reclamo de premios en 30 días.",
  },
  // All other 'slot' type raffles have been removed.
];