import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Obtener un proyecto de un usuario en específico
      const ownerId = 1 // Number(req.query.ownerId);
      const projectId = Number(req.query.projectId);
      const project = await prisma.project.findMany({
        where: {
          ownerId,
          id: projectId
          }
        });
      res.status(200).json(project);
    } else {
        res.status(405).end();
      }
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}