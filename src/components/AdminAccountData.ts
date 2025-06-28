import type { AdminAccount } from '../types';

export const initialAdminAccountsData: AdminAccount[] = [
  { 
    id: 'roble', 
    username: 'Roble', 
    password: 'Apamate.25', // Updated Password
    displayName: 'Roble Admin (Super)', 
    securityQuestion: 'Nombre de tu primera mascota?', 
    securityAnswer: 'bobby', // Case-insensitive comparison usually
    whatsAppNumber: '584120000000'
  },
  { 
    id: 'saman', 
    username: 'Saman', 
    password: 'samanpassword',
    displayName: 'Saman Admin', 
    securityQuestion: 'Ciudad natal?', 
    securityAnswer: 'caracas',
    whatsAppNumber: '584241208234'
  },
  { 
    id: 'araguaney', 
    username: 'Araguaney', 
    password: 'araguaneypassword',
    displayName: 'Araguaney Admin', 
    securityQuestion: 'Color favorito?', 
    securityAnswer: 'azul',
    whatsAppNumber: '58412565484' 
  },
  { 
    id: 'cedro', 
    username: 'Cedro', 
    password: 'cedropassword',
    displayName: 'Cedro Admin',
    securityQuestion: 'Comida favorita?',
    securityAnswer: 'pizza',
    whatsAppNumber: '584243304708'
  },
];