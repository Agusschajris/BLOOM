import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all datasets
      // const datasets = await prisma.dataset.findMany();
      // res.status(200).json(datasets);
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
