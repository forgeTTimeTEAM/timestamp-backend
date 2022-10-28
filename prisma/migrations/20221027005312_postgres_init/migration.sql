-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sprint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "modulesId" TEXT NOT NULL,
    CONSTRAINT "sprint_modulesId_fkey" FOREIGN KEY ("modulesId") REFERENCES "modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sprint" ("id", "modulesId", "name") SELECT "id", "modulesId", "name" FROM "sprint";
DROP TABLE "sprint";
ALTER TABLE "new_sprint" RENAME TO "sprint";
CREATE TABLE "new_video_marker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videosId" TEXT NOT NULL,
    CONSTRAINT "video_marker_videosId_fkey" FOREIGN KEY ("videosId") REFERENCES "videos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_video_marker" ("createdAt", "id", "time", "title", "updatedAt", "videosId") SELECT "createdAt", "id", "time", "title", "updatedAt", "videosId" FROM "video_marker";
DROP TABLE "video_marker";
ALTER TABLE "new_video_marker" RENAME TO "video_marker";
CREATE TABLE "new_videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "classDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sprintId" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    CONSTRAINT "videos_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "videos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_videos" ("classDate", "createdAt", "id", "sprintId", "title", "updatedAt", "url", "usersId") SELECT "classDate", "createdAt", "id", "sprintId", "title", "updatedAt", "url", "usersId" FROM "videos";
DROP TABLE "videos";
ALTER TABLE "new_videos" RENAME TO "videos";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modulesId" TEXT NOT NULL,
    CONSTRAINT "users_modulesId_fkey" FOREIGN KEY ("modulesId") REFERENCES "modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_users" ("createdAt", "email", "id", "isAdmin", "modulesId", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "isAdmin", "modulesId", "name", "password", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
