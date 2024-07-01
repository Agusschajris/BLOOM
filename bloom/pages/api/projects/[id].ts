import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Prisma, Project } from '@prisma/client';
import { gzip, gunzip } from "node:zlib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectId = Number(req.query.id);
  try {
    if (req.method === 'GET') {
      // Obtener un proyecto de un usuario en específico
      const ownerId = 1 // Number(req.query.ownerId);
      const project: Project | null = await prisma.project.findUnique({
        where: {
          ownerId,
          id: projectId
        }
      });

      if (!project)
        return res.status(404).json({ error: 'Proyecto no encontrado' });

      if (project.blocks)
        project.blocks = JSON.parse((await gunzip.__promisify__(project.blocks)).toString());

      res.status(200).json(project);
    } else if (req.method === 'PUT') {
      let { name, blocks } = req.body;
      const data: Prisma.ProjectUpdateInput = { lastEdited: { set: new Date() } };

      // Buscar el proyecto por su ID
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!existingProject)
        return res.status(404).json({ error: 'Proyecto no encontrado' });

      if (name)
        data.name = name;
      if (blocks)
        data.blocks = (await gzip.__promisify__(JSON.stringify(blocks))).toString();

      // Actualizo
      await prisma.project.update({
        where: { id: projectId },
        data
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