/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `modules` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_modulesId_key";

-- CreateIndex
CREATE UNIQUE INDEX "modules_name_key" ON "modules"("name");
