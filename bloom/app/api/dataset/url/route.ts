/*
import prisma from "../../../../lib/prisma";

// Save a new dataset
export async function POST(request: Request) {
  const { dataset } = await request.json();
  const newDataset = await prisma.dataset.create({
    data: {
      dataset,
    },
  });

  if (!newDataset)
    return new Response("Server error (prisma)", { status: 500 });

  return new Response(JSON.stringify(newDataset), { status: 201 });
}
*/