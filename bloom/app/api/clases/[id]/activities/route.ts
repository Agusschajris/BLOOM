import prisma from "../../../../../lib/prisma";
// import {NextRequest} from "next/server";


// Obtener todas las actividades de una clase determinada
export async function GET(request: Request, { params } : { params: { id: string }}) {

    const authId = request.headers.get("auth-js-id");
    if (!authId) {
        return new Response("Authorization ID is missing.", { status: 400 });
    }

    let orderBy = {};
    const url = new URL(request.url);

    const defaultOrAsc = url.searchParams.get("orderDirection") ?? 'asc';
    const defaultOrDesc = url.searchParams.get("orderDirection") ?? 'desc';

    // Verificar el valor del parámetro orderBy que envía el front
    switch (url.searchParams.get("orderBy")) {
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

    // Verifico que soy el dueño de la clase
    const clase = await prisma.clase.findUnique({
        where: { id: Number(params.id) },
        select: { ownerId: true }
    });

    if (!clase || clase.ownerId !== authId) {
        return new Response("You do not own this class.", { status: 403 });
    }

    const activities = await prisma.activity.findMany({
        where: {
            claseId: Number(params.id),
        },
        orderBy,
    });
    return new Response(JSON.stringify(activities), { status: 200 });
}

// Crear una nueva actividad
export async function POST(request: Request, { params }: { params: { id: string }}) {
    const authId = request.headers.get("auth-js-id");
    if (!authId) {
        return new Response("Authorization ID is missing.", { status: 400 });
    }

    const { name, datasets, task} = await request.json();
    if (!name || !task)
        return new Response("Falta información para crear una actividad.", { status: 400 })
    if (typeof name !== 'string' || typeof task !== 'string')
        return new Response("Datos inválidos.", { status: 400 })

    // Verifico que soy el dueño de la clase
    const clase = await prisma.clase.findUnique({
        where: { id: Number(params.id) },
        select: { ownerId: true }
    });

    if (!clase || clase.ownerId !== authId) {
        return new Response("Unauthorized: You do not own this class.", { status: 403 });
    }

    const newActivity = await prisma.activity.create({
        data: {
            name,
            claseId: Number(params.id),
            datasets: {
                connect: datasets.map((datasetId: number) => ({ id: datasetId })),
            },
            task
        },
    });

    return new Response(JSON.stringify(newActivity), { status: 201 });
}