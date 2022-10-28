import { IUsersRequest } from "../../interfaces/users";
import { prisma } from "../../prisma/index";
import { hash } from "bcryptjs";
import { AppError } from "../../errors/AppError";

const createUserService = async ({
  email,
  password,
  modulesId,
  name,
  isAdmin,
}: IUsersRequest) => {
  const userExists = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (userExists) {
    throw new AppError(" already exists");
  }

  console.log();

  const moduleExists = await prisma.modules.findFirst({
    where: {
      id: modulesId,
    },
  });

  if (!moduleExists) {
    throw new AppError("module id not found", 404);
  }

  const userCreated = await prisma.users.create({
    select: {
      name: true,
      email: true,
    },
    data: {
      email: email,
      name: name,
      password: await hash(password, 10),
      modulesId: modulesId,
      isAdmin: isAdmin,
    },
  });

  return userCreated;
};

export { createUserService };
