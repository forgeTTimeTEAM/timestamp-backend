/*
  Warnings:

  - Added the required column `classDate` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "classDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sprintId" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    CONSTRAINT "videos_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "videos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_videos" ("createdAt", "id", "sprintId", "title", "updatedAt", "url", "usersId") SELECT "createdAt", "id", "sprintId", "title", "updatedAt", "url", "usersId" FROM "videos";
DROP TABLE "videos";
ALTER TABLE "new_videos" RENAME TO "videos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
