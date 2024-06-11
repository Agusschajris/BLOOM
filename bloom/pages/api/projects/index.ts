
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

/*
NO SE, CUALQUIERA MAL
AHora tengo que recibir cuando tengo que crear un nuevo proyecto y prear ese nuevo proyecto
también poder enviarle al front el proyecto que me esté pidiendo
https://youtube.com/playlist?list=PLrAw40DbN0l2dg--IB6xTsEQTD1Qb1aBa&si=WRvuy51xJbAG8btb
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all projects
      const userId = 1 // req.query.userId --> para cuando tenga más de un user
      const projects = await prisma.project.findMany({
        where: {
          id: userId,
        },
      });
      res.status(200).json(projects);
    } else if (req.method === 'POST') {
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

