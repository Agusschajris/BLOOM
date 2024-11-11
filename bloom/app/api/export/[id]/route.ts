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

  const drive = await getDriveFromAuth();

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
        mimeType: "application/x-ipynb+json",
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

  let modelJsonId = await getFileId(drive, modelFolderId, "model.json");
  if (modelJsonId)
    await drive.files.delete({ fileId: modelJsonId });

  let modelWeightsId = await getFileId(drive, modelFolderId, "model.weights.bin");
  if (modelWeightsId)
    await drive.files.delete({ fileId: modelWeightsId });

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

export async function DELETE(request: NextRequest, { params } : { params: { id: string }}) {
  const drive = await getDriveFromAuth();

  const projectResponse = await fetch(`http://localhost:3000/api/projects/${params.id}`, {
    method: "GET",
    headers: request.headers
  });

  if (!projectResponse.ok)
    return new Response("Project not found.", projectResponse);

  const project = await projectResponse.json() as ProjectData;

  let bloomFolderId = await getFolderId(drive, "root", "Bloom");
  if (!bloomFolderId)
    return new Response("Bloom folder not found.", { status: 200 });

  let projectFolderId = await getFolderId(drive, bloomFolderId, project.name);
  if (!projectFolderId)
    return new Response("Project folder not found.", { status: 200 });

  await drive.files.delete({ fileId: projectFolderId });

  return new Response("Project deleted.", { status: 200 });
}

async function getDriveFromAuth(): Promise<Drive> {
  const session = await auth();
  if (!session || !session.user)
    throw new Error("User not found.");

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id!,
    },
    select: {
      access_token: true,
    }
  });

  if (!account || !account.access_token)
    throw new Error("Account not found.");

  const dAuth = new google.auth.OAuth2();
  dAuth.setCredentials({ access_token: account.access_token });

  return google.drive({ version: "v3", auth: dAuth });
}

function generateModel(blockData: string, datasetInfo: DatasetInfo): tf.Sequential {
  // Reset the TensorFlow backend to clear any existing variables
  tf.disposeVariables();

  const blocks = decompressBlocks(blockData);
  const seq = tf.sequential();
  if (blocks.length !== 0)
    blocks[0].args.inputShape = [datasetInfo.features.length];
  let lastUnitSize = datasetInfo.features.length;

  blocks.forEach((block) => {
    seq.add(
      (tf.layers[block.funName as keyof typeof tf.layers] as (
        args: any
      ) => tf.layers.Layer)(block.args)
    );
    if (block.args.units)
      lastUnitSize = block.args.units as number;
  });

  if (lastUnitSize !== datasetInfo.target.length)
    seq.add(tf.layers.dense({
      units: datasetInfo.target.length,
      inputShape: blocks.length > 0 ? undefined : [datasetInfo.features.length]
    }));

  return seq;
}

function generateNotebook(projectName: string, datasetId: number, datasetInfo: DatasetInfo) {
  const notebook = structuredClone(defaultNotebook);

  // 5dataset_id_explanation
  (notebook.cells[5].source as string[])[3] +=
    `${datasetInfo.name}](https://archive.ics.uci.edu/dataset/${datasetId}).\n`;

  // 6dataset_id
  (notebook.cells[6].source as string[])[0] += `${datasetId})\n`;

  // 16model_import
  (notebook.cells[16].source as string) += `${projectName}/model/model.json')\n`;

  // 23model_predict
  datasetInfo.features.forEach(feature => {
    (notebook.cells[23].source as string[]).push(`    '${feature.name}': [${feature.type === "Categorical" ? "''" : "0"}],\n`);
  });
  (notebook.cells[23].source as string[]).push(
    "})\n",
    "\n"
  );
  if (datasetInfo.has_categorical_values)
  {
    (notebook.cells[23].source as string[]).push(
      "# Codificar valores categóricos a números.\n",
      "for column in predict_data.columns:\n",
      "    if column in label_encoders:\n",
      "        predict_data[column] = label_encoders[column].transform(predict_data[column])\n",
      "\n"
    );
  }
  (notebook.cells[23].source as string[]).push(
    "result = model.predict(predict_data)\n",
    "df = pd.DataFrame([dict(zip(dataset.targets.columns, result))])\n"
  )
  if (datasetInfo.has_categorical_values) {
    (notebook.cells[23].source as string[]).push(
      "# Codificar valores categóricos a números.\n",
      "for column in df.columns:\n",
      "    if column in label_encoders:\n",
      "        predict_data[column] = label_encoders[column].inverse_transform(predict_data[column])\n",
      "\n"
    );
  }
  (notebook.cells[23].source as string[]).push("display(df)");
  
  // 25model_save
  (notebook.cells[25].source as string) += `${projectName}/model/model.json')`;

  // TODO: add categorical related cells (and remove them)
  if (!datasetInfo.has_categorical_values) {
    // 4library_import
    (notebook.cells[4].source as string[]).pop();
    (notebook.cells[4].source as string[]).pop();
    // 9categorical_explanation
    // 10categorical
    (notebook.cells as any[]).splice(9, 2);
  }

  if (!datasetInfo.has_missing_values) {
    // 7missing_values_explanation
    // 8missing_values
    (notebook.cells as any[]).splice(7, 2);
  }

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

async function getFolderId(drive: Drive, parentFolderId: string, folderName: string): Promise<string | null> {
  const response = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and '${parentFolderId}' in parents`,
    fields: "files(id)"
  });

  const list = response.data.files;

  if (list && list.length > 0 && list[0].id)
    return list[0].id;

  return null;
}

async function getFolderOrCreate(drive: Drive, parentFolderId: string, folderName: string): Promise<string> {
  const possibleFolderId = await getFolderId(drive, parentFolderId, folderName);

  if (possibleFolderId)
    return possibleFolderId;

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