import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Error TS6305: El archivo de salida '/vercel/path0/vite.config.d.ts' no se ha creado a partir del archivo fuente '/vercel/path0/vite.config.ts'.
// El archivo está en el programa porque:
//   Coincide con el patrón de inclusión 'vite.config.ts' en '/vercel/path0/tsconfig.json'