
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all projects
      const userId = 1 // req.query.userId --> para cuando tenga más de un user
      let orderBy = {};

    // verifico el valor del parametro orderBy que me manda el front
    switch (req.query.orderBy) {
      case 'alfabetic': // Orden alfabético
        orderBy = { name: 'asc' };
        break;
      case 'creationDate':
        orderBy = { creationDate: 'desc' };
        break;
      case 'lastEdited':
        orderBy = { lastEdited: 'desc' };
        break;
    
    default: // por default se ordena por el último editado
      orderBy = { lastEdited: 'desc' };
  }

      const projects = await prisma.project.findMany({
        where: {
          id: userId,
        },
        orderBy,
      });
      res.status(200).json(projects);
    } 
    
    else if (req.method === 'POST') {
      // Save a new project
      const { project } = req.body;
      if (!project || !project.name || !project.ownerId || !project.datasetId) {
        return res.status(400).json({ error: 'Falta información para crear un proyecto' });
      }
      const newProject = await prisma.project.create({
        data: {
          name: project.name,
          ownerId: project.ownerId,
          datasetId: project.datasetId,
        },
      });
      res.status(201).json(newProject);
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

