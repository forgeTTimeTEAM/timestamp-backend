import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma";

const findUsersByGroupService = async (groupId: string) => {
  const groupExists = await prisma.groups.findFirst({
    where: {
      id: groupId,
    },
  });

  if (!groupExists) {
    throw new AppError("Group not found", 404);
  }

  const data = await prisma.groups.findMany({
    where: {
      id: groupId,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          groupId: true,
        },
      },
    },
  });

  return data;
};

export { findUsersByGroupService };
