import { AppError } from "../../errors/AppError";
import { Role } from "../../interfaces/users";
import { prisma } from "../../prisma";
import { removeObjectProperty } from "../../utils/removeObjectProperty";

const findUsersByModuleService = async (
  moduleId: string,
  userId: string,
  userRole: Role
) => {
  const moduleExists = await prisma.modules.findFirst({
    where: {
      id: moduleId,
    },
  });

  if (!moduleExists) {
    throw new AppError("Module not found", 404);
  }

  if (userRole === "INSTRUCTOR") {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        modules: true,
      },
    });

    if (user!.modules[0].moduleId !== moduleId) {
      throw new AppError("Access denied", 403);
    }
  }

  const module = await prisma.modules.findMany({
    where: {
      id: moduleId,
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
    },
  });

  if (module[0].users.length > 0) {
    module.forEach(({ users }, index) => {
      removeObjectProperty(users[index].user, "password");
    });
  }

  return module;
};

export { findUsersByModuleService };
