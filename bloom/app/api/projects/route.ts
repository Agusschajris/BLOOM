import prisma from "@lib/prisma";
import {NextRequest} from "next/server";


// Obtener todos los proyectos
export async function GET(request: NextRequest) {

    let orderBy: {};
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

    const ownerId = request.headers.get("auth-js-id");

    if (!ownerId)
        return new Response("Not authenticated.", { status: 403 });

    const projects = await prisma.project.findMany({
        where: {
            ownerId, //session!.user!.id,
        },
        orderBy,
        select: {
            id: true,
            name: true,
            creationDate: true,
            lastEdited: true,
        }
    });
    return new Response(JSON.stringify(projects), { status: 200 });
}


// Guardar un nuevo proyecto
export async function POST(request: Request) {
    const { name, datasetId } = await request.json();

    if (!name || !datasetId)
        return new Response("Falta información para crear un proyecto.", { status: 400 })
    if (typeof name !== 'string' || typeof datasetId !== 'number')
        return new Response("Datos inválidos.", { status: 400 })

    const newProject = await prisma.project.create({
        data: {
            name,
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id!, //project.ownerId,
            dataset: datasetId
        },
    });
    return new Response(JSON.stringify(newProject), { status: 201 });
}