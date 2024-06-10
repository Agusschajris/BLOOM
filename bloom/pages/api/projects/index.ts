/*
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

/*
NO SE, CUALQUIERA MAL
AHora tengo que recibir cuando tengo que crear un nuevo proyecto y prear ese nuevo proyecto
también poder enviarle al front el proyecto que me esté pidiendo
https://youtube.com/playlist?list=PLrAw40DbN0l2dg--IB6xTsEQTD1Qb1aBa&si=WRvuy51xJbAG8btb
*/
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all projects
      const userId = 1 //req.query.userId; //--> cuando tenga más de un usuario
      const projects = await prisma.project.findMany({
        where: {
          userId: userId,
        },
      });
      res.status(200).json(projects);
    }
    } else if (req.method === 'POST') {
      // Save a new dataset
      const { dataset } = req.body;
      const newDataset = await prisma.dataset.create({
        data: {
          dataset,
        },
      });

      res.status(201).json(newDataset);
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
*/
