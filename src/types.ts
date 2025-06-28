export type PublicView = 'home' | 'adminLogin' | 'verifyTicket' | 'claims';

export type UUID = string; // For IDs

export interface AdminAccount {
  id: UUID;
  username: string;
  password?: string; // Made optional for initial data, will be set for new admins
  securityQuestion?: string;
  securityAnswer?: string;
  displayName: string;
  whatsAppNumber?: string;
}

export interface RaffleItem {
  id: UUID;
  raffleType: 'grid'; // Only grid type remains
  name?: string; // Can be used as a fallback or internal reference if raffleTitle is the main display for grid
  imageUrl: string;
  ticketPurchaseLink: string; 
  ticketCheckLink: string;    

  day: string; 
  month: string; 
  date: string; // Primary date display for grid
  progressPercentage: number; // May or may not be relevant for grid, keep for now
  targetDate?: string; // Grid raffles might still have an end date for the draw
  administratorWhatsApp?: string; 
  managedByAdminId?: UUID; 

  ticketCost?: number;

  description?: string; 
  conditions?: string;  
  isFeatured?: boolean; 

  // Fields for grid-style raffles (now primary)
  prizeDetails: string[]; 
  soldNumbers?: number[]; 
  gridNumbersTotal: number; // e.g., 100 for a 10x10 grid
  raffleTitle: string; 
  raffleSubtitle?: string; 
  callToAction?: string; 

  // New fields for card-specific draw
  gridCardWinningNumber?: string;
  isGridCardDrawComplete?: boolean;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export interface UserTicket {
  raffleId: UUID;
  ticketNumbers: string[]; 
  mainDrawTicketNumbers?: string[]; 
}

export interface MockUser {
  id: UUID;
  name: string;
  whatsappNumber: string; 
  tickets: UserTicket[];
}

// New type for displaying grouped tickets by user
export interface UserTicketsViewData {
    user: MockUser;
    groupedTickets: Array<{
        raffle: RaffleItem;
        ticketNumbers: string[];
    }>;
}

export type PaymentMethod = 'Pago Móvil' | 'Efectivo' | 'Otro';
export type PaymentStatus = 'Pendiente' | 'Validado' | 'Rechazado';

export interface TicketRegistration {
  id: UUID; 
  raffleId: UUID;
  raffleName: string;
  participantName: string;
  participantWhatsApp: string;
  ticketNumber: string; // For grid, this could be one of potentially multiple selected numbers per registration
  registrationDate: string; 
  paymentMethod: PaymentMethod;
  paymentReference: string; // For Pago Móvil reference or cash payment notes
  paymentStatus: PaymentStatus; // To track validation by admin
  managedByAdminId: UUID; 
}