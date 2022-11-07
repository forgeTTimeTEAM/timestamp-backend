import { prisma } from "../../prisma";

import { hash } from "bcryptjs";

import { AppError } from "../../errors/AppError";

import { IUsersRequest } from "../../interfaces/users";

import { removeObjectProperty } from "../../utils";

const createUserService = async ({
  name,
  email,
  password,
  groupId,
  moduleId,
}: IUsersRequest) => {
  if (!name) {
    throw new AppError("You must provide a name");
  }

  if (!email) {
    throw new AppError("You must provide a email");
  }

  if (!password) {
    throw new AppError("You must provide a password");
  }

  if (!groupId) {
    throw new AppError("You must provide a group id");
  }

  if (!moduleId) {
    throw new AppError("You must provide a module id");
  }

  const groupExists = await prisma.groups.findFirst({
    where: {
      id: groupId,
    },
  });

  if (!groupExists) {
    throw new AppError("Group not found", 404);
  }

  const moduleExists = await prisma.modules.findFirst({
    where: {
      id: moduleId,
    },
  });

  if (!moduleExists) {
    throw new AppError("Module not found", 404);
  }

  const userExists = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (userExists) {
    throw new AppError("Email is already in use", 409);
  }

  const createdUser = await prisma.users.create({
    include: {
      modules: true,
    },
    data: {
      email,
      name,
      password: await hash(password, 10),
      groupId,
      modules: {
        create: {
          moduleId,
        },
      },
    },
  });

  removeObjectProperty(createdUser, "password");

  return createdUser;
};

export { createUserService };
