/*
  Warnings:

  - You are about to drop the column `usersId` on the `videos` table. All the data in the column will be lost.
  - Added the required column `modulesId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_usersId_fkey";

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "usersId",
ADD COLUMN     "modulesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_modulesId_fkey" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
