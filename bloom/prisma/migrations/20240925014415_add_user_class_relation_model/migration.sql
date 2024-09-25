/*
  Warnings:

  - You are about to drop the `_UserClases` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserClases" DROP CONSTRAINT "_UserClases_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserClases" DROP CONSTRAINT "_UserClases_B_fkey";

-- DropTable
DROP TABLE "_UserClases";

-- CreateTable
CREATE TABLE "UserClase" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "claseId" INTEGER NOT NULL,

    CONSTRAINT "UserClase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClase_userId_claseId_key" ON "UserClase"("userId", "claseId");

-- AddForeignKey
ALTER TABLE "UserClase" ADD CONSTRAINT "UserClase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClase" ADD CONSTRAINT "UserClase_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
