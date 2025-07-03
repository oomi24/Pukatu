import type { MockUser } from '../types';

export const mockUsers: MockUser[] = [
  {
    id: 'user1',
    name: 'Carlos Rodriguez',
    whatsappNumber: '584121234567',
    tickets: [
      { raffleId: '1', ticketNumbers: ['123', '124'], mainDrawTicketNumbers: ['1111'] },
      { raffleId: '2', ticketNumbers: ['788'] },
    ],
  },
  {
    id: 'user2',
    name: 'Ana Gomez',
    whatsappNumber: '584167654321',
    tickets: [
      { raffleId: '1', ticketNumbers: ['501'] },
      { raffleId: '3', ticketNumbers: ['003', '004', '005'], mainDrawTicketNumbers: ['2222'] },
    ],
  },
  {
    id: 'user3',
    name: 'Pedro Alfonzo',
    whatsappNumber: '584240000000',
    tickets: [
      // Corrected raffleId from 'main_draw_special' to '4' (an existing raffle)
      // and moved the 4-digit ticket to mainDrawTicketNumbers.
      // Added some illustrative 3-digit tickets for raffle '4'.
      { raffleId: '4', ticketNumbers: ['111', '234'], mainDrawTicketNumbers: ['3333'] }
    ]
  },
  {
    id: 'user4',
    name: 'Luisa Fernanda',
    whatsappNumber: '584129876543',
    tickets: [], 
  },
  {
    id: 'user5',
    name: 'Jorge Paez',
    whatsappNumber: '584120000001',
    tickets: [
        { raffleId: '5', ticketNumbers: ['505'], mainDrawTicketNumbers: ['4321'] },
    ]
  }
];