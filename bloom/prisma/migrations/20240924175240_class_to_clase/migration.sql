/*
  Warnings:

  - You are about to drop the column `classId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserClasses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_classId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_UserClasses" DROP CONSTRAINT "_UserClasses_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserClasses" DROP CONSTRAINT "_UserClasses_B_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "classId",
ADD COLUMN     "claseId" INTEGER;

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "_UserClasses";

-- CreateTable
CREATE TABLE "Clase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserClases" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserClases_AB_unique" ON "_UserClases"("A", "B");

-- CreateIndex
CREATE INDEX "_UserClases_B_index" ON "_UserClases"("B");

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClases" ADD CONSTRAINT "_UserClases_A_fkey" FOREIGN KEY ("A") REFERENCES "Clase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClases" ADD CONSTRAINT "_UserClases_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
