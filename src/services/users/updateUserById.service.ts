import { AppError } from "../../errors/AppError";
import { IUserUpdateById } from "../../interfaces/users";
import { prisma } from "../../prisma";

const updateUserByIdService = async (
  userRequest: IUserUpdateById,
  id: string
) => {
  const info = userRequest;

  //não possui
  /*  if (!("name" in info) && !("groupId" in info)) {
    throw new AppError("Only can change name and groupId");
  } */

  //possui ou um ou outro
  //
  /*  if ("name" in info || "groupId" in info) {
    if ([...(info as string[])].length >= 3) {
      throw new AppError("Only can change name and groupId");
    }
  } */

  const userExists = await prisma.users.findFirst({
    where: {
      id: id,
    },
  });

  if (!userExists) {
    throw new AppError("User not exists");
  }

  const groupExists = await prisma.groups.findFirst({
    where: {
      id: info.groupId,
    },
  });

  if (!groupExists) {
    throw new AppError("Group not exists");
  }

  const userUpdated = await prisma.users.update({
    data: {
      name: info.name,
      groupId: info.groupId,
    },
    where: {
      id: id,
    },
  });

  console.log(userUpdated);

  return userUpdated;
};

export { updateUserByIdService };
