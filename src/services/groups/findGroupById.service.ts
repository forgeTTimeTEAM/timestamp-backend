import { hash } from "bcryptjs";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma";
import { removeObjectProperty } from "../../utils";

const findGroupByIdService = async (
  id: string,
  userId: string,
  userRole: string
) => {
  const group = await prisma.groups.findUnique({
    where: {
      id,
    },
    include: {
      modules: true,
      users: true,
    },
  });

  if (!group) {
    throw new AppError("Group not found", 404);
  }

  if (
    userRole === "INSTRUCTOR" &&
    group.users.every((el) => el.id !== userId)
  ) {
    throw new AppError("Access denied", 403);
  }

  group.users.forEach((user) => {
    removeObjectProperty(user, "password");
  });

  return group;
};

export { findGroupByIdService };
