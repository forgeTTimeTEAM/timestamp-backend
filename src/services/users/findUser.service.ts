import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma";
import { removeObjectProperty } from "../../utils";

const findUserService = async (id: string) => {
  const user = await prisma.users.findUnique({ where: { id } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  removeObjectProperty(user, "password");

  return user;
};

export { findUserService };
