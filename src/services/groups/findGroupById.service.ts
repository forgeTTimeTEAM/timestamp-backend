import { prisma } from "../../prisma";

import { AppError } from "../../errors/AppError";

import { removeObjectProperty } from "../../utils";

const findGroupByIdService = async (id: string) => {
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

  if (group.users.length) {
    group.users.forEach((user) => {
      removeObjectProperty(user, "password");
    });
  }

  return group;
};

export { findGroupByIdService };
