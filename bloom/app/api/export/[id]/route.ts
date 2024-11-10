import {NextRequest} from "next/server";
import { google } from "googleapis";
import {decompressBlocks} from "@lib/blockydata";
import * as tf from "@tensorflow/tfjs";
import defaultNotebook from "@public/defaultNotebook.json";
import {DatasetInfo, ProjectData} from "@/app/api/projects/[id]/route";
import {auth} from "@/auth";
import prisma from "@lib/prisma";
//import { drive_v3 } from "googleapis";

export async function GET(request: NextRequest, { params } : { params: { id: string }}) {

  const projectResponse = await fetch(`http://localhost:3000/api/projects/${params.id}`, {
    method: "GET",
    headers: request.headers
  });

  if (!projectResponse.ok)
    return new Response("Project not found.", projectResponse);

  const project = await projectResponse.json() as ProjectData;

  const model = generateModel(project.blocks, project.datasetInfo);
  const notebook = generateNotebook(project.dataset, project.datasetInfo);

  const session = await auth();
  if (!session || !session.user)
    return new Response("Not authenticated.", { status: 401 });

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id!,
    },
    select: {
      access_token: true,
    }
  });

  if (!account || !account.access_token)
    return new Response("Account not found.", { status: 401 });

  const dAuth = new google.auth.OAuth2();
  dAuth.setCredentials({ access_token: account.access_token });

  const drive = google.drive({ version: "v3", auth: dAuth });

  const res = await drive.files.list({
    pageSize: 10,
    fields: 'files(id, name)',
  });

  console.log(res.data);

  return new Response(JSON.stringify({ model, notebook }), { status: 200 });
}

function generateModel(blockData: string, datasetInfo: DatasetInfo): tf.Sequential {
  const blocks = decompressBlocks(blockData);
  const seq = tf.sequential();
  if (blocks.length !== 0)
    blocks[0].args.inputShape = [datasetInfo.features];
  let lastUnitSize = datasetInfo.target;

  blocks.forEach((block) => {
    seq.add(
      (tf.layers[block.funName as keyof typeof tf.layers] as (
        args: any
      ) => tf.layers.Layer)(block.args)
    );
    if (block.args.units)
      lastUnitSize = block.args.units as number;
  });

  if (lastUnitSize !== datasetInfo.target)
    seq.add(tf.layers.reshape({ targetShape: [datasetInfo.target] }));

  return seq;
}

function generateNotebook(datasetId: number, datasetInfo: DatasetInfo) {
  const notebook = structuredClone(defaultNotebook);

  (notebook.cells[5].source as string[])[3] +=
    `${datasetInfo.name}](https://archive.ics.uci.edu/dataset/${datasetId}).`;

  (notebook.cells[6].source as string[])[0] += `${datasetId})`;

  return notebook;
}