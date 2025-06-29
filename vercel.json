import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  try {
    const raffle = req.body;
    if (!raffle.id) {
      return res.status(400).json({ message: 'Falta el id del sorteo' });
    }
    await kv.set(`raffle:${raffle.id}`, raffle);
    return res.status(200).json({ message: 'Sorteo creado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el sorteo' });
  }
}