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
      // Get all datasets
      // const datasets = await prisma.dataset.findMany();
      // res.status(200).json(datasets);
    } else if (req.method === 'POST') {
      // Save a new dataset
      console.log(req.body);
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
              dataset: result!.url
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
