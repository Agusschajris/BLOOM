import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { gzip as _gzip } from 'node:zlib';
import { promisify } from 'node:util';

const gzip = promisify(_gzip);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Obtener todos los proyectos
      const userId = 1; // req.query.userId --> para cuando tengas más de un usuario
      let orderBy = {};
      const defaultOrAsc = req.query.orderDirection ? req.query.orderDirection : 'asc';
      const defaultOrDesc = req.query.orderDirection ? req.query.orderDirection : 'desc';

      // Verificar el valor del parámetro orderBy que envía el front
      switch (req.query.orderBy) {
        case 'alphabetic': // Orden alfabético
          orderBy = { name: defaultOrAsc };
          break;
        case 'creationDate':
          orderBy = { creationDate: defaultOrDesc };
          break;
        case 'lastEdited':
          orderBy = { lastEdited: defaultOrDesc };
          break;
        default: // Por defecto, se ordena por el último editado
          orderBy = { lastEdited: 'desc' };
      }

      const projects = await prisma.project.findMany({
        where: {
          ownerId: userId,
        },
        orderBy,
      });
      res.status(200).json(projects);
    } else if (req.method === 'POST') {
      // Guardar un nuevo proyecto
      const { name, datasetId } = req.body;
      if (!name || !datasetId)
        return res.status(400).json('Falta información para crear un proyecto');
      if (typeof name !== 'string' || typeof datasetId !== 'number')
        return res.status(400).json('Datos inválidos');

      const newProject = await prisma.project.create({
        data: {
          name,
          ownerId: 1, //project.ownerId,
          datasetId: datasetId,
          blocks: await gzip('[]')
        },
      });
      res.status(201).json(newProject);
    } else
      res.status(405).end();
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}