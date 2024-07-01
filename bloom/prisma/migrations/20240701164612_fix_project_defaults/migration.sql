/*
  Warnings:

  - Made the column `creationDate` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blocks` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "creationDate" SET NOT NULL,
ALTER COLUMN "blocks" SET NOT NULL;
