import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PUT') {
      const { projectId } = req.query;
      let { name, blocks } = req.body;

      // Buscar el proyecto por su ID
      const existingProject = await prisma.project.findUnique({
        where: { id: Number(projectId) },
      });

      if (!existingProject)
        return res.status(404).json({ error: 'Proyecto no encontrado' });

      if (!name || typeof name !== 'string') name = existingProject.name;
      if (!blocks || typeof blocks !== 'string') blocks = existingProject.blocks;

      // Actualizo
      await prisma.project.update({
        where: { id: Number(projectId) },
        data: {
          name,
          blocks,
          lastEdited: { set: new Date() },
        },
      });    

      res.status(200).json({ message: 'Proyecto actualizado correctamente' });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}