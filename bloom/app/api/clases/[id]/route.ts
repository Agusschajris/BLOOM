import prisma from '@lib/prisma';
import { Clase } from '@prisma/client';
import { gzip as _gzip, gunzip as _gunzip } from "node:zlib";


// Obtener una clase de un usuario en específico
export async function GET(request: Request, { params } : { params: { id: string }}) {

    const clase: Clase | null = await prisma.clase.findUnique({
        where: {
            ownerId: request.headers.get("auth-js-id")!, //session?.user?.id,
            id: Number(params.id),
        }
    });

    if (!clase)
        return new Response("Clase not found.", { status: 404 });

    return new Response(JSON.stringify(clase), { status: 200 });
}


// Eliminar una clase
export async function DELETE(request: Request, { params } : { params: { id: string }}) {

    const deletedClase = await prisma.clase.delete({
        where: {
            id: Number(params.id),
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id
        },
    });

    if (!deletedClase)
        return new Response("Project not found.", { status: 404 });

    return new Response(JSON.stringify(deletedClase), { status: 200 });
}


// Unirse a una clase (alumnos)
export async function POST(request: Request, { params } : { params: { id: string }}) {
    const authId = request.headers.get("auth-js-id");

    if (!authId) {
        return new Response("Authorization ID is missing.", { status: 400 });
    }

    const classExists = await prisma.clase.findUnique({
        where: { 
            id: Number(params.id),
        },
    });

    if (!classExists) {
        return new Response("Class not found.", { status: 404 });
    }

    const alreadyJoined = await prisma.userClase.findUnique({
        where: {
            userId_claseId: {
                userId: authId,
                claseId: Number(params.id),
            },
        },
    });

    if (alreadyJoined) {
        return new Response("User already joined this class.", { status: 400 });
    }

    const userClass = await prisma.userClase.create({
        data: {
            userId: authId,
            claseId: Number(params.id),
        },
    });

    return new Response(JSON.stringify(userClass), { status: 201 });
}