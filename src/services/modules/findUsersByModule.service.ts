import { AppError } from "../../errors/AppError";
import { IModulesRequest } from "../../interfaces/modules";
import { prisma } from "../../prisma";

const findUsersByModuleService = async ({
  moduleId,
  userId,
}: IModulesRequest) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  const moduleExists = await prisma.modules.findFirst({
    where: {
      id: moduleId,
    },
  });

  if (!moduleExists) {
    throw new AppError("Module not found", 404);
  }

  const users = await prisma.modules.findMany({
    where: {
      id: moduleId,
    },
    include: {
      users_modules: {
        include: {
          user: true,
        },
      },
    },
  });

  if (
    users[0].users_modules.every((el) => el.id !== user!.id) &&
    user!.role === "INSTRUCTOR"
  ) {
    throw new AppError("You dont have access to this module");
  }

  return users;
};

export { findUsersByModuleService };
