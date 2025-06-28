// @ts-ignore
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { RaffleItem } from '../src/types'; // Asegúrate que la ruta a tus tipos sea correcta

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const newRaffle = request.body as RaffleItem;

    // Validación básica en el servidor por seguridad
    if (!newRaffle || !newRaffle.id || !newRaffle.raffleTitle) {
        return response.status(400).json({ message: 'Datos del sorteo inválidos.' });
    }

    // Guardamos el sorteo en Vercel KV usando su ID como clave
    await kv.set(`raffle:${newRaffle.id}`, newRaffle);

    return response.status(200).json({ message: 'Sorteo guardado exitosamente!', raffle: newRaffle });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en el servidor';
    return response.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
  }
}