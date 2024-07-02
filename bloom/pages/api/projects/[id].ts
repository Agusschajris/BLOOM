import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Prisma, Project } from '@prisma/client';
import { gzip as _gzip, gunzip as _gunzip } from "node:zlib";
import { promisify } from 'node:util';

const gzip = promisify(_gzip);
const gunzip = promisify(_gunzip);

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

      if (project.blocks) {
        const gunzippedBlocks = await gunzip(project.blocks);
        console.log(gunzippedBlocks.toString());
        project.blocks = JSON.parse(gunzippedBlocks.toString());
      }


      res.status(200).json(project);
    } else if (req.method === 'PUT') {
      let { name, blocks } = req.body;
      const data: Prisma.ProjectUpdateInput = {};

      // Buscar el proyecto por su ID
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!existingProject)
        return res.status(404).json({ error: 'Proyecto no encontrado' });

      if (name)
        data.name = name;
      if (blocks) {
      data.blocks = await gzip(JSON.stringify(blocks));
        data.lastEdited = { set: new Date() };
      }

      // Actualizo
      await prisma.project.update({
        where: { id: projectId },
        data
      });

      res.status(200).json({ message: 'Proyecto actualizado correctamente' });
    } else if (req.method === 'DELETE') {
      // Eliminar un proyecto
      if (!projectId)
        return res.status(400).json('Falta información para eliminar un proyecto');
      if (typeof projectId !== 'number')
        return res.status(400).json('Datos inválidos');
    
      const deletedProject = await prisma.project.delete({
        where: {
          id: projectId,
        },
      });
      res.status(200).json(deletedProject);
    } else if (req.method === 'POST'){
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!existingProject)
        return res.status(404).json({ error: 'Proyecto no encontrado' });

      const duplicatedProject = await prisma.project.create({
        data: {
          name: `Copia de ${existingProject.name}`,
          ownerId: existingProject.ownerId,
          datasetId: existingProject.datasetId,
          blocks: existingProject.blocks
        },
      });
      res.status(200).json(duplicatedProject);
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}