import { AppError } from "../../errors/AppError";
import { IUserUpdateById } from "../../interfaces/users";
import { prisma } from "../../prisma";
import { removeObjectProperty } from "../../utils";

const updateUserByIdService = async (
  userRequest: IUserUpdateById,
  id: string
) => {
  for (const key in userRequest) {
    if (key !== "groupId") {
      throw new AppError("It is only possible to update the groupId");
    }
  }

  if (!("groupId" in userRequest)) {
    throw new AppError("Need to provide the data in the request");
  }

  const userExists = await prisma.users.findFirst({
    where: {
      id: id,
    },
  });

  if (!userExists) {
    throw new AppError("User not found", 404);
  }

  const groupExists = await prisma.groups.findFirst({
    where: {
      id: userRequest.groupId,
    },
  });

  if (!groupExists) {
    throw new AppError("Group not found", 404);
  }

  if (userExists.groupId === userRequest.groupId) {
    throw new AppError("Provide a different groupId than the current one", 404);
  }

  const userUpdated = await prisma.users.update({
    data: {
      groupId: userRequest.groupId,
    },
    where: {
      id: id,
    },
  });

  removeObjectProperty(userUpdated, "password");

  return userUpdated;
};

export { updateUserByIdService };
