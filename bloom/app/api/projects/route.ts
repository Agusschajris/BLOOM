//import { auth } from "../../../auth";
//import { Session } from "node:inspector";
import prisma from "../../../lib/prisma";
import {NextRequest} from "next/server";

const authHeader = "auth-js-id";

// Obtener todos los proyectos
export async function GET(request: NextRequest) {
    let orderBy = {};
    const defaultOrAsc = request.nextUrl.searchParams.get("orderDirection") ?? 'asc';
    const defaultOrDesc = request.nextUrl.searchParams.get("orderDirection") ?? 'desc';

    // Verificar el valor del parámetro orderBy que envía el front
    switch (request.nextUrl.searchParams.get("orderBy")) {
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
            break;
    }

    const ownerId = request.headers.get(authHeader);
    console.log("Owner ID: ", ownerId);
    console.log("Order By: ", orderBy)
    if (!ownerId)
        return new Response("Not authenticated.", { status: 403 });
    try {
        const projects = await prisma.project.findMany({
            where: {
                ownerId, //session!.user!.id,
            },
            orderBy,
        });
        return new Response(JSON.stringify(projects), { status: 200 });
    } catch (e) {
        console.error('Error fetching projects:', e); // Log the error to debug
        return new Response("Internal Server Error", { status: 500 });
    }
}

// Guardar un nuevo proyecto
export async function POST(request: Request) {
    const { name, datasetId, blocks } = await request.json();

    if (!name || !datasetId)
        return new Response("Falta información para crear un proyecto.", { status: 400 })
    if (typeof name !== 'string' || typeof datasetId !== 'number')
        return new Response("Datos inválidos.", { status: 400 })

    const newProject = await prisma.project.create({
        data: {
            name,
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id!, //project.ownerId,
            datasetId,
            blocks: Buffer.from(blocks.data)
        },
    });
    return new Response(JSON.stringify(newProject), { status: 201 });
}