import {NextRequest} from "next/server";
import { google } from "googleapis";
import {decompressBlocks} from "@lib/blockydata";
import * as tf from "@tensorflow/tfjs";
import defaultNotebook from "@public/defaultNotebook.json";
import {DatasetInfo, ProjectData} from "@/app/api/projects/[id]/route";
import {auth} from "@/auth";
import prisma from "@lib/prisma";
import { drive_v3 } from "googleapis";
import Drive = drive_v3.Drive;
import {
  getModelArtifactsInfoForJSON,
  getModelJSONForModelArtifacts
} from "@tensorflow/tfjs-core/dist/io/io_utils";
import {ModelArtifacts, ModelJSON, SaveResult, WeightsManifestConfig} from "@tensorflow/tfjs-core/dist/io/types";
import {CompositeArrayBuffer} from "@tensorflow/tfjs-core/dist/io/composite_array_buffer";
import stream from "node:stream";

export async function GET(request: NextRequest, { params } : { params: { id: string }}) {

  const projectResponse = await fetch(`http://localhost:3000/api/projects/${params.id}`, {
    method: "GET",
    headers: request.headers
  });

  if (!projectResponse.ok)
    return new Response("Project not found.", projectResponse);

  const project = await projectResponse.json() as ProjectData;

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

  let bloomFolderId = await getFolderOrCreate(drive, "root", "Bloom");
  let projectFolderId = await getFolderOrCreate(drive, bloomFolderId, project.name);
  let modelFolderId = await getFolderOrCreate(drive, projectFolderId, "model");

  let notebookId = await getFileId(drive, projectFolderId, `${project.name}.ipynb`);
  if (!notebookId)
  {
    const notebook = generateNotebook(project.name, project.dataset, project.datasetInfo);
    let notebookFile = await drive.files.create({
      requestBody: {
        name: `${project.name}.ipynb`,
        //mimeType: "application/x-ipynb+json",
        parents: [projectFolderId],
      },
      media: {
        mimeType: "application/x-ipynb+json",
        body: JSON.stringify(notebook),
      },
      fields: "id"
    });
    if (!notebookFile.data.id)
      throw new Error("Error creating notebook file.");
    notebookId = notebookFile.data.id!;
  }

  const model = generateModel(project.blocks, project.datasetInfo);

  await model.save((tf.io.withSaveHandler(async (modelArtifacts: ModelArtifacts): Promise<SaveResult> => {
    const weightsManifest: WeightsManifestConfig = [{
      paths: ['./model.weights.bin'],
      weights: modelArtifacts.weightSpecs!,
    }];
    const modelTopologyAndWeightManifest: ModelJSON =
      getModelJSONForModelArtifacts(modelArtifacts, weightsManifest);

    await drive.files.create({
      requestBody: {
        name: "model.json",
        mimeType: "application/json",
        parents: [modelFolderId]
      },
      media: {
        mimeType: "application/json",
        body: JSON.stringify(modelTopologyAndWeightManifest)
      }
    });


    if (modelArtifacts.weightData != null) {
      const weightBuffer = CompositeArrayBuffer.join(modelArtifacts.weightData);

      await drive.files.create({
        requestBody: {
          name: "model.weights.bin",
          mimeType: "application/octet-stream",
          parents: [modelFolderId]
        },
        media: {
          mimeType: "application/octet-stream",
          body: stream.Readable.from(Buffer.from(weightBuffer))
        }
      });
    }

    return {
      modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts),
      responses: []
    };
  })))

  return new Response(JSON.stringify({notebookId}), { status: 200 });
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

function generateNotebook(projectName: string, datasetId: number, datasetInfo: DatasetInfo) {
  const notebook = structuredClone(defaultNotebook);

  (notebook.cells[5].source as string[])[3] +=
    `${datasetInfo.name}](https://archive.ics.uci.edu/dataset/${datasetId}).\n`;

  (notebook.cells[6].source as string[])[0] += `${datasetId})\n`;

  (notebook.cells[10].source as string[])[0] += `${projectName}/model/model.json')\n`;

  return notebook;
}

async function getFileId(drive: Drive, parentFolderId: string, fileName: string): Promise<string | null> {
  const response = await drive.files.list({
    q: `name = '${fileName}' and '${parentFolderId}' in parents`,
    fields: "files(id)"
  });

  const list = response.data.files;

  if (list && list.length > 0 && list[0].id)
    return list[0].id;

  return null;
}

async function getFolderOrCreate(drive: Drive, parentFolderId: string, folderName: string): Promise<string> {
  const response = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and '${parentFolderId}' in parents`,
    fields: "files(id)"
  });

  const list = response.data.files;

  if (list && list.length > 0 && list[0].id)
    return list[0].id;

  const newFolder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId]
    },
    fields: "id"
  });

  if (!newFolder.data.id)
    throw new Error("Error creating folder.");

  return newFolder.data.id;
}
