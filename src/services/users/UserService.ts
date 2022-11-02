import { prisma } from "../../prisma/index";

import { hash } from "bcryptjs";

import { AppError } from "../../errors/AppError";

import { IUsersRequest } from "../../interfaces/users";

const createUserService = async ({
  name,
  email,
  password,
  groupId,
}: IUsersRequest) => {
  const userExists = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (userExists) {
    throw new AppError("Email is already in use");
  }

  const groupExists = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
  });

  if (!groupExists) {
    throw new AppError("Group not found", 404);
  }

  const createdUser = await prisma.users.create({
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    data: {
      email,
      name,
      password: await hash(password, 10),
      groupId,
    },
  });

  return createdUser;
};

const findUsersByGroupService = async (groupId: string) => {
  const groupExists = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
  });

  if (!groupExists) {
    throw new AppError("Group not found", 404);
  }

  const data = await prisma.group.findMany({
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

export { createUserService, findUsersByGroupService };
