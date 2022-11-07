import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma";

const deleteUserService = async (id: string) => {
  try {
    await prisma.$transaction([
      prisma.users_modules.deleteMany({
        where: { userId: id },
      }),
      prisma.users.delete({ where: { id } }),
    ]);
  } catch (error) {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }

    if (typeof error.meta !== "object") {
      throw error;
    }

    if (error.meta.cause !== "Record to delete does not exist.") {
      console.log("test");
      throw error;
    }

    throw new AppError("User not found", 404);
  }
};

export { deleteUserService };
