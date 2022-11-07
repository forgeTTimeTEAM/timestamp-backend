import { prisma } from "../../prisma";

import { AppError } from "../../errors/AppError";

import { IModuleRequest } from "../../interfaces/modules";

import { handleSequencialObject, removeObjectProperty } from "../../utils";

const createModuleService = async ({
  sprintPrefixName,
  groupId,
  name,
}: IModuleRequest) => {
  const group = await prisma.groups.findUnique({
    where: { id: groupId },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!group) {
    throw new AppError("Group not found", 404);
  }

  const users = {
    create: group.users.map(({ id }) => ({ userId: id })),
  };

  const sprints = {
    create: handleSequencialObject("name", 8, sprintPrefixName),
  };

  const module = await prisma.modules.create({
    data: {
      groupId,
      name,
      sprints,
      users,
    },
    include: {
      sprints: true,
      users: {
        include: {
          user: true,
        },
      },
    },
  });

  if (module.users.length) {
    module.users.forEach(({ user }) => {
      removeObjectProperty(user, "password");
    });
  }

  return module;
};

export { createModuleService };
