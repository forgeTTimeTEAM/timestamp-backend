import { hash } from "bcryptjs";

import { AppError } from "../../errors/AppError";
import { IUsersRequest } from "../../interfaces/users";
import { prisma } from "../../prisma";
import { removeObjectProperty } from "../../utils/removeObjectProperty";

const createUserService = async ({
  name,
  email,
  password,
  groupId = null,
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

  const userExists = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (userExists) {
    throw new AppError("Email is already in use", 409);
  }

  if (groupId) {
    const groupExists = await prisma.groups.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!groupExists) {
      throw new AppError("Group not found", 404);
    }
  }

  const createdUser = await prisma.users.create({
    data: {
      email,
      name,
      password: await hash(password, 10),
      groupId: groupId || null,
    },
  });

  removeObjectProperty(createdUser, "password");

  return createdUser;
};

export { createUserService };
