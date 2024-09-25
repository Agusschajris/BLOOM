import prisma from '../../../../../../lib/prisma';
import { Prisma, Activity } from '@prisma/client';
import { gzip as _gzip, gunzip as _gunzip } from "node:zlib";
import { promisify } from 'node:util';
//import { auth } from '../../../../auth';
//import { Session } from 'node:inspector';

const gzip = promisify(_gzip);
const gunzip = promisify(_gunzip);

// Obtener una actividad de una clase en específico
export async function GET({ params } : { params: { id: string; claseId: string }}) {
    /*const session = await auth();
    if (session !instanceof Session)
        return new Response("Not authenticated.", { status: 403 });*/

    const activity: Activity | null = await prisma.activity.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            clase: true,
        },
    });

    if (!activity)
        return new Response("Activity not found.", { status: 404 });

    if (activity.claseId !== Number(params.claseId)) {
        return new Response("Activity does not belong to this class.", { status: 403 });
    }

    if (activity.blocks) {
        const gunzippedBlocks = await gunzip(activity.blocks);
        console.log(gunzippedBlocks.toString()); // DEBUG
        activity.blocks = JSON.parse(gunzippedBlocks.toString());
    }

    return new Response(JSON.stringify(activity), { status: 200 });
}

// Updatear actividad (cuando la edita el profesor)
export async function PUT(request: Request, { params } : { params: { id: string; claseId: string }}) {
    /*const session = await auth();
    if (session !instanceof Session)
        return new Response("Not authenticated.", { status: 403 });*/

    let { name, task, blocks } = await request.json();
    const data: Prisma.ActivityUpdateInput = {};

    const existingActivity = await prisma.activity.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            clase: true,
        },
    });

    if (!existingActivity)
        return new Response("Activity not found.", { status: 404 });

    if (existingActivity.claseId !== Number(params.claseId)) {
        return new Response("Activity does not belong to this class.", { status: 403 });
    }

    if (name)
        data.name = name;

    if (task)
        data.task = task;

    if (blocks) {
        data.blocks = await gzip(JSON.stringify(blocks));
        data.lastEdited = { set: new Date() };
    }

    await prisma.activity.update({
        where: { id: Number(params.id) },
        data,
    });

    return new Response("Activity updated.", { status: 200 });
}

// Eliminar una actividad
export async function DELETE({ params } : { params: { id: string; claseId: string }}) {
    /*const session = await auth();
    if (session !instanceof Session)
        return new Response("Not authenticated.", { status: 403 });*/

    const deletedActivity = await prisma.activity.delete({
        where: {
            id: Number(params.id),
        },
        include: {
            clase: true,
        },
    });

    if (!deletedActivity)
        return new Response("Project not found.", { status: 404 });

    if (deletedActivity.claseId !== Number(params.claseId)) {
        return new Response("Activity does not belong to this class.", { status: 403 });
    }

    return new Response(JSON.stringify(deletedActivity), { status: 200 });
}