import prisma from '../../../../lib/prisma';
import busboy from "busboy";
import { v2 as cloudinary } from "cloudinary";
//import { auth } from '../../../../auth';
//import { Session } from 'node:inspector';
import {NextRequest} from "next/server";
import { IncomingHttpHeaders } from 'node:http';

cloudinary.config({
    cloud_name: 'project-bloom',
    api_key: '333331186286244',
    api_secret: process.env.CLOUDINARY_API_KEY,
    secure: true,
});

// Get all datasets or of specified id
export async function GET(request: NextRequest) {
    const datasetId = request.nextUrl.searchParams.get('id');
    if (!datasetId) {
        // Get all datasets
        const datasets = await prisma.dataset.findMany();
        return new Response(JSON.stringify(datasets), { status: 200 });
    }

    // Get dataset by id
    const dataset = await prisma.dataset.findUnique({
        where: {
            id: Number(datasetId),
        },
    });

    if (!dataset)
        return new Response("Dataset not found", { status: 404 });

    return new Response(JSON.stringify(dataset), { status: 200 });
}

// Create a new dataset
export async function POST(request: Request) {
    /*const session = await auth();
    if (!(session instanceof Session))
        return new Response("Not authenticated", { status: 403 });*/

    const incomingHttpHeaders: IncomingHttpHeaders = {};

    request.headers.forEach((value, key) => {
        incomingHttpHeaders[key.toLowerCase()] = value;
    });
    let response = new Response();
    const bb = busboy({ headers: incomingHttpHeaders });
    let accInfo: any[] = [];
    bb.on('file', (name, file, info) => {
        console.log(info);
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "raw", use_filename: true }, (err, result) => {
            if (err)
                return console.log(err);

            console.log(result);
            prisma.dataset.create({
                data: {
                    name: name,
                    dataset: result?.secure_url!,
                    userId: request.headers.get('auth-js-id'),
                },
            }).then((dataset) => {
                accInfo.push(dataset);
            }).catch(err => console.log("prisma error:", err));
        });
        file.pipe(uploadStream);
    });

    bb.on('error', error => {
        console.log("bb error:", error)
        response = new Response(JSON.stringify(error), { status: 500 });
    });

    bb.on('close', () => {
        console.log(accInfo);
        response = new Response(JSON.stringify(accInfo), {
            status: 201,
            headers: { 'Connection': 'close' }
        });
        //res.writeHead(201, { Connection: 'close' }).json(accInfo);
    });

    bb.end(await request.arrayBuffer());

    return response;
}