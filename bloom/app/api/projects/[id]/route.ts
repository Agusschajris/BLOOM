import prisma from '../../../../lib/prisma';
import { Prisma, Project } from '@prisma/client';

// Obtener un proyecto de un usuario en específico
export async function GET(request: Request, { params } : { params: { id: string }}) {

    const project: Project | null = await prisma.project.findUnique({
        where: {
            ownerId: request.headers.get("auth-js-id")!, //session?.user?.id,
            id: Number(params.id),
        }
    });

    if (!project)
        return new Response("Project not found.", { status: 404 });

    return new Response(JSON.stringify(project), { status: 200 });
}

// Updatear proyecto
export async function PUT(request: Request, { params } : { params: { id: string }}) {

    let { name, blocks } = await request.json();
    const data: Prisma.ProjectUpdateInput = {};

    const existingProject = await prisma.project.findUnique({
        where: {
            id: Number(params.id),
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id
        },
    });

    if (!existingProject)
        return new Response("Project not found.", { status: 404 });

    if (name)
        data.name = name;
    if (blocks) {
        data.blocks = blocks;
        data.lastEdited = { set: new Date() };
    }

    await prisma.project.update({
        where: { id: Number(params.id) },
        data,
    });

    return new Response("Project updated.", { status: 200 });
}

// Eliminar un proyecto
export async function DELETE(request: Request, { params } : { params: { id: string }}) {

    const deletedProject = await prisma.project.delete({
        where: {
            id: Number(params.id),
            ownerId: request.headers.get("auth-js-id")!, //session!.user!.id
        },
    });

    if (!deletedProject)
        return new Response("Project not found.", { status: 404 });

    return new Response(JSON.stringify(deletedProject), { status: 200 });
}

// Duplicar un proyecto
export async function POST(request: Request, { params } : { params: { id: string }}) {

    const userId = request.headers.get("auth-js-id")!;

    const existingProject: Project | null = await prisma.project.findUnique({
        where: {
            ownerId: userId, //session!.user!.id,
            id: Number(params.id)
        }
    });

    if (!existingProject)
        return new Response("Project not found.", { status: 404 });

    const duplicateProject = await prisma.project.create({
        data: {
            name: `Copy of ${existingProject.name}`,
            ownerId: userId, //session!.user!.id!,
            datasetId: existingProject.datasetId,
            blocks: existingProject.blocks,
        },
    });

    return new Response(JSON.stringify(duplicateProject), { status: 201 });
}