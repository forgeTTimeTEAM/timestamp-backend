import { AppError } from "../../errors/AppError";
import { IVideoRequest } from "../../interfaces/videos";
import { prisma } from "../../prisma";

const createVideoService = async (
  groupId: string,
  { title, url = null, releaseDate, sprintId }: IVideoRequest
) => {
  if (!sprintId) {
    throw new AppError("Sprint id needed", 400);
  }

  const sprintExists = await prisma.sprints.findFirst({
    where: {
      id: sprintId,
    },
  });

  if (!sprintExists) {
    throw new AppError("Sprint not found", 404);
  }

  const findInstructor = prisma.groups.findUnique({
    where: {
      id: groupId,
    },
    include: {
      modules: {
        include: {
          sprints: {
            where: {
              id: sprintId,
            },
          },
        },
      },
    },
  });

  if (!findInstructor) {
    throw new AppError("Instructor not allowed", 401);
  }

  if (url) {
    const videoExists = await prisma.videos.findFirst({
      where: {
        url,
      },
    });

    if (videoExists) {
      throw new AppError("This video already exists");
    }
  }

  const createdVideo = await prisma.videos.create({
    select: {
      title: true,
      url: true,
      releaseDate: true,
      sprintId: true,
      createdAt: true,
      updatedAt: true,
    },
    data: {
      title,
      releaseDate,
      url: url || null,
      sprintId,
    },
  });

  return createdVideo;
};

export { createVideoService };
