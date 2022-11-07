import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma";

const deleteVideoService = async (id: string) => {
  const videoExists = await prisma.videos.findFirst({
    where: {
      id,
    },
  });

  if (!videoExists) {
    throw new AppError("Video not found", 404);
  }

  await prisma.videos.update({
    where: {
      id,
    },
    data: {
      url: null,
    },
  });
};

export { deleteVideoService };
