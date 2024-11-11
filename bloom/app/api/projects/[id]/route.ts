import prisma from '@lib/prisma';
import { Prisma, Project } from '@prisma/client';

export type DatasetInfo = {
    name: string,
    has_missing_values: boolean,
    variables: number,
    features: number,
    target: number
}
export interface ProjectData extends Project {
    datasetInfo: DatasetInfo;
}


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

    // Add dataset metadata
    const archiveResponse = await fetch(`https://archive.ics.uci.edu/api/dataset?id=${project.dataset}`, {
        method: "GET",
    });

    if (!archiveResponse.ok)
        return new Response("Dataset not found.", { status: 404 });

    const meta = await archiveResponse.json();
    const datasetInfo: DatasetInfo = {
        has_missing_values: meta.data.has_missing_values as boolean,
        variables: (meta.data.variables as any[]).length,
        features: (meta.data.variables as any[]).filter(f => f.role == "Feature").length,
        target: (meta.data.variables as any[]).filter(f => f.role == "Target").length,
        name: meta.data.name as string
    };

    (project as ProjectData).datasetInfo = datasetInfo;

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

    await fetch(`http://localhost:3000/api/export/${params.id}`, {
        method: "DELETE",
        headers: request.headers
    });

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
            dataset: existingProject.dataset,
            blocks: existingProject.blocks,
        },
    });

    return new Response(JSON.stringify(duplicateProject), { status: 201 });
}