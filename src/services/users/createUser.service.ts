import { hash } from "bcryptjs";

import { AppError } from "../../errors/AppError";
import { IUsersRequest } from "../../interfaces/users";
import { prisma } from "../../prisma";

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

export { createUserService };
