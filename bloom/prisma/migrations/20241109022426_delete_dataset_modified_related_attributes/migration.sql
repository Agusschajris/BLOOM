/*
  Warnings:

  - You are about to drop the column `datasetId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Dataset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToDataset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dataset" DROP CONSTRAINT "Dataset_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToDataset" DROP CONSTRAINT "_ActivityToDataset_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToDataset" DROP CONSTRAINT "_ActivityToDataset_B_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "datasets" TEXT[];

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "datasetId",
ADD COLUMN     "dataset" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "datasets" TEXT[];

-- DropTable
DROP TABLE "Dataset";

-- DropTable
DROP TABLE "_ActivityToDataset";
