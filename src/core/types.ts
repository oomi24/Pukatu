import type { Record as PBRecordModel } from 'pocketbase';

/**
 * A base record type representing the common fields in a PocketBase record.
 */
export type PBRecord = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  expand?: { [key: string]: any };
};

/**
 * Represents a user from the 'users' collection.
 */
export type User = PBRecord & {
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  phone: string;
  password?: string; // For client-side auth simulation only, not a DB field.
};

export enum TicketStatus {
  Available = 'Available',
  Pending = 'Pending',
  Sold = 'Sold',
}

// Alias for backward compatibility with components not yet refactored.
export const NumberStatus = TicketStatus;

export enum PaymentMethod {
  Cash = 'Efectivo',
  Transfer = 'Transferencia',
  Crypto = 'Cripto',
  PagoMovil = 'Pago Móvil',
}

/**
 * Information about the buyer, likely stored as a JSON field in a Ticket record.
 * This replaces the previous top-level Buyer type.
 */
export interface Buyer {
  name: string;
  phone: string;
  paymentMethod: PaymentMethod;
  ci?: string;
  pagoMovilPhone?: string;
  reference?: string;
}

/**
 * Represents a ticket from a 'tickets' collection.
 * This unified model replaces RaffleNumber and MillionBagNumber.
 */
export type Ticket = PBRecord & {
  raffle: string; // Relation (ID) to a Raffle record
  ticketNumber: string; // e.g., "042" or "999"
  status: TicketStatus;
  buyerInfo?: Buyer; // Stored as JSON
};

// To allow for a smoother transition, we'll keep the old interfaces
// but they should be considered deprecated and will be removed later.
export interface RaffleNumber {
  number: number;
  status: TicketStatus;
  buyer?: Buyer;
}
export interface MillionBagNumber {
    number: string;
    status: TicketStatus;
    buyer?: Buyer;
}


/**
 * Represents a draw configuration, likely stored as a JSON field in a Raffle record.
 */
export interface DrawTriggerConfig {
  mode: 'date' | 'sales' | 'hybrid';
  notifyThreshold: number;
}

/**
 * Represents a raffle from the 'raffles' collection.
 * This unified model replaces the old Raffle and MillionBagState types.
 */
export type Raffle = PBRecord & {
  isMillionBag: boolean;
  prizeImage?: string; // Optional, especially for Million Bag
  description: string;
  terms: string;
  size: 100 | 1000;
  closeDate: string; // ISO Date String
  isActive: boolean;
  managedBy?: string; // Relation (ID) to an admin User record
  winningNumber?: number | string | null;
  // The following fields would be part of a real backend implementation,
  // replacing fields like 'numbers' that were stored in localStorage.
  winningTicket?: string; // Relation (ID) to the winning Ticket record
  drawConfig?: DrawTriggerConfig;
  numbers: (RaffleNumber | MillionBagNumber)[]; // This union is handled by type-guards in components
};


// The MillionBagState is now absorbed into the Raffle type with isMillionBag=true
// and this alias is DEPRECATED. It will be removed in a future refactor.
export type MillionBagState = Raffle;


// UI-specific types, not from the database
export type AdminView = 'raffles' | 'payments' | 'finance' | 'millionBag' | 'users';


// --- PocketBase Collection Types ---
// These types represent the target schema in the PocketBase backend.
// The application will be migrated to use these types.
// -----------------------------------

// Tipo para la colección 'users' (colección Auth)
export type UserRecord = PBRecordModel & {
  email: string;
  username: string;
  verified: boolean;
  isAdmin: boolean; // Campo personalizado
  balance: number;  // Campo personalizado
  avatar?: string;  // Opcional, si PocketBase lo genera o lo usas
};

// Tipo para la colección 'raffles'
export type RaffleRecord = PBRecordModel & {
  title: string;
  description: string;
  totalTickets: number;
  pricePerTicket: number;
  drawDate: string; // La fecha se maneja como string ISO en PocketBase
  isActive: boolean;
  winner?: string; // ID del usuario ganador (relación), opcional hasta el sorteo
  expand?: {
    winner: UserRecord; // Para cuando se expande la relación
  };
};

// Tipo para la colección 'tickets'
export type TicketRecord = PBRecordModel & {
  ticketNumber: number | string; // Depende de si es número o texto en PB
  raffle: string; // ID del sorteo (relación)
  buyer: string;  // ID del comprador (relación)
  purchaseDate: string; // Fecha de compra
  expand?: {
    raffle: RaffleRecord;
    buyer: UserRecord;
  };
};

// Tipo para la colección 'draws'
export type DrawRecord = PBRecordModel & {
  raffle: string;        // ID del sorteo (relación)
  winningTicket: string; // ID del boleto ganador (relación)
  winner: string;        // ID del usuario ganador (relación)
  drawDateTime: string;  // Fecha y hora del sorteo
  expand?: {
    raffle: RaffleRecord;
    winningTicket: TicketRecord;
    winner: UserRecord;
  };
};

// Ejemplo: Respuesta de login
export type AuthResponse = {
  token: string;
  record: UserRecord;
};