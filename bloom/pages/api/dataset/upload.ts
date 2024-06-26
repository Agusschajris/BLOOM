import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import busboy from "busboy";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: 'project-bloom',
  api_key: '333331186286244',
  api_secret: process.env.CLOUDINARY_API_KEY,
  secure: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (req.url === '/datasets') {
        // Get all datasets
        const datasets = await prisma.dataset.findMany();
        res.status(200).json(datasets);
      } else if (req.url === '/datasets/project/:projectId') {
        // Get dataset from specific project
        const projectId = Number(req.query.projectId);
        const userId = 1 // Number(req.query.ownerId);
        const dataset = await prisma.dataset.findMany({
          where: {
            userId,
            projects: {
              some: {
                id: projectId,
              },
            },
          },
        });
        res.status(200).json(dataset);
      } else {
        res.status(404).end();
      }
    } else if (req.method === 'POST') {
      // Save a new dataset
      console.log(req.body);
      //const { userId } = req.body; -> para guardar también el userId así se linkea con el User (lo dejo comentado por las dudas)
      const bb = busboy({ headers: req.headers })
      let accInfo: any[] = []
      bb.on('file', (name, file, info) => {
        console.log(name);
        console.log(info);
        //const fileContent = file.read();
        const uploadStream = cloudinary.uploader.upload_stream({resource_type: "raw", use_filename: true}, (err, result) => {
          if (err)
            return console.log(err);

          console.log(result);
          prisma.dataset.create({
            data: {
              name,
              dataset: result!.url,
              //userId
            },
          }).then((entry) => {
            accInfo.push(entry);
          }).catch(err => console.log("prisma error:", err))
        });//.end(fileContent);
        file.pipe(uploadStream);
      });
      bb.on('error', error => {
        console.log("bb error:", error)
        //res.status(500).json(error);
      });
      bb.on('close', () => {
        console.log(accInfo);
        res.writeHead(201, { Connection: 'close' }).json(accInfo);
      })
      bb.end(req.body)
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
