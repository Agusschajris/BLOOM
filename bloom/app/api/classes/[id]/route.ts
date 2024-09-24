import prisma from '../../../../lib/prisma';
import { Prisma, Clase } from '@prisma/client';
import { gzip as _gzip, gunzip as _gunzip } from "node:zlib";
import { promisify } from 'node:util';
//import { auth } from '../../../../auth';
//import { Session } from 'node:inspector';

// Obtener una clase de un usuario en específico
export async function GET(request: Request, { params } : { params: { id: string }}) {
    /*const session = await auth();
    if (session !instanceof Session)
        return new Response("Not authenticated.", { status: 403 });*/

    const clase: Clase | null = await prisma.clase.findUnique({
        where: {
            ownerId: request.headers.get("auth-js-id")!, //session?.user?.id,
            id: Number(params.id),
        }
    });

    if (!clase)
        return new Response("Clase not found.", { status: 404 });

    // if (clase.activities) {
    //     const gunzippedBlocks = await gunzip(project.blocks);
    //     console.log(gunzippedBlocks.toString()); // DEBUG
    //     project.blocks = JSON.parse(gunzippedBlocks.toString());
    // }

    return new Response(JSON.stringify(clase), { status: 200 });
}

/*
// updatear proyecto
export async function PUT(request: Request, { params } : { params: { id: string }}) {
    // const session = await auth();
    // if (session !instanceof Session)
    //     return new Response("Not authenticated.", { status: 403 });

    let { name } = await request.json();
    const data: Prisma.ProjectUpdateInput = {};

    const existingClase = await prisma.clase.findUnique({
        where: {
            id: Number(params.id),
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id
        },
    });

    if (!existingClase)
        return new Response("Project not found.", { status: 404 });

    if (name)
        data.name = name;
    // if (blocks) {
    //     data.blocks = await gzip(JSON.stringify(blocks));
    //     data.lastEdited = { set: new Date() };
    // }

    await prisma.clase.update({
        where: { id: Number(params.id) },
        data,
    });

    return new Response("Project updated.", { status: 200 });
}


// Eliminar un proyecto
export async function DELETE(request: Request, { params } : { params: { id: string }}) {
    // const session = await auth();
    // if (session !instanceof Session)
    //     return new Response("Not authenticated.", { status: 403 });

    const deletedProject = await prisma.project.delete({
        where: {
            id: Number(params.id),
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id
        },
    });

    if (!deletedProject)
        return new Response("Project not found.", { status: 404 });

    return new Response(JSON.stringify(deletedProject), { status: 200 });
}*/