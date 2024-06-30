import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

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
        case 'alfabetic': // Orden alfabético
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
    } else if (req.method === 'PUT') {
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