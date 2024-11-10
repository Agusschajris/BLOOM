import prisma from "@lib/prisma";
import {NextRequest} from "next/server";


// Obtener todos las clases
export async function GET(request: NextRequest) {

  const authId = request.headers.get("auth-js-id");

  if (!authId)
    return new Response("Not authenticated.", { status: 403 });

  let where =
    request.nextUrl.searchParams.get("role") === "owner" ? {
        ownerId: authId
      } : {
        users: {
          some: {
            userId: authId
          }
        }
      };

  const clases = await prisma.clase.findMany({
    where
  });

  return new Response(JSON.stringify(clases), { status: 200 });
}


// Crear nueva clase
export async function POST(request: Request) {

  const { name } = await request.json();
  if (!name)
    return new Response("Falta información para crear un proyecto.", { status: 400 })
  if (typeof name !== 'string')
    return new Response("Datos inválidos.", { status: 400 })

  const newClase = await prisma.clase.create({
    data: {
      name,
      ownerId: request.headers.get("auth-js-id")!, //session!.user!.id!, //project.ownerId,
      activities: {},
      users: {},
    },
  });
  return new Response(JSON.stringify(newClase), { status: 201 });
}