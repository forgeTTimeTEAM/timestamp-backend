import { hash } from "bcryptjs";

import { AppError } from "../../errors/AppError";
import { IUsersRequest } from "../../interfaces/users";
import { prisma } from "../../prisma";

const createUserService = async ({
  name,
  email,
  password,
  groupId = null,
}: IUsersRequest) => {
  const userExists = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (userExists) {
    throw new AppError("Email is already in use");
  }

  if (groupId) {
    const groupExists = await prisma.groups.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!groupExists) throw new AppError("Group not found", 404);
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
      groupId: groupId || null,
    },
  });

  return createdUser;
};

export { createUserService };
