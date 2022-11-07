import { prisma } from "../../prisma";

import { removeObjectProperty } from "../../utils/removeObjectProperty";

const listUsersService = async () => {
  const users = await prisma.users.findMany();

  users.forEach((user) => {
    removeObjectProperty(user, "password");
  });

  return users;
};

export { listUsersService };
