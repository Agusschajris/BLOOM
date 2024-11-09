/*
  Warnings:

  - The `datasets` column on the `Activity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dataset` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `datasets` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "datasets",
ADD COLUMN     "datasets" INTEGER[];

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "dataset",
ADD COLUMN     "dataset" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "datasets",
ADD COLUMN     "datasets" INTEGER[];
