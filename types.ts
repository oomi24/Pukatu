
export interface User {
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  phone: string;
  password?: string; // Only for creation/login forms
}

export enum NumberStatus {
  Available = 'Available',
  Pending = 'Pending',
  Sold = 'Sold',
}

export enum PaymentMethod {
  Cash = 'Efectivo',
  Transfer = 'Transferencia',
  Crypto = 'Cripto',
  PagoMovil = 'Pago Móvil',
}

export interface Buyer {
  name: string;
  phone: string;
  paymentMethod: PaymentMethod;
  ci?: string;
  pagoMovilPhone?: string;
  reference?: string;
}

export interface RaffleNumber {
  number: number;
  status: NumberStatus;
  buyer?: Buyer;
}

export interface MillionBagNumber {
    number: string; // Changed to string for 000-999 format
    status: NumberStatus;
    buyer?: Buyer;
}


export interface Raffle {
  id: string;
  prizeImage: string;
  description: string;
  terms: string;
  size: 100 | 1000;
  closeDate: string;
  numbers: RaffleNumber[];
  winningNumber?: number | null;
  isActive: boolean;
  managedBy?: string; // New field to assign an admin
}

export interface DrawTriggerConfig {
    mode: 'date' | 'sales' | 'hybrid';
    notifyThreshold: number; // Percentage to notify users
}

export interface MillionBagState {
    isActive: boolean;
    closeDate: string;
    numbers: MillionBagNumber[];
    winningNumber: string | null; // Changed to string
    config: DrawTriggerConfig;
}

export type AdminView = 'raffles' | 'payments' | 'finance' | 'millionBag' | 'users';