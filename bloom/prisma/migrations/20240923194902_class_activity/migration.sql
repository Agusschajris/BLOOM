/*
  Warnings:

  - You are about to drop the column `organization` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `professor` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ClassDatasets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClassDatasets" DROP CONSTRAINT "_ClassDatasets_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassDatasets" DROP CONSTRAINT "_ClassDatasets_B_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organization",
DROP COLUMN "professor",
DROP COLUMN "username",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "_ClassDatasets";

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "classId" INTEGER,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "blocks" BYTEA NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityToDataset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToDataset_AB_unique" ON "_ActivityToDataset"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToDataset_B_index" ON "_ActivityToDataset"("B");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToDataset" ADD CONSTRAINT "_ActivityToDataset_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToDataset" ADD CONSTRAINT "_ActivityToDataset_B_fkey" FOREIGN KEY ("B") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
