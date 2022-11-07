import { prisma } from "../../prisma";
import { removeObjectProperty } from "../../utils/removeObjectProperty";

const listGroupsService = async () => {
  const groups = await prisma.groups.findMany({
    include: {
      modules: true,
      users: true,
    },
  });

  groups.forEach((group) => {
    group.users.forEach((user) => {
      removeObjectProperty(user, "password");
    });
  });

  return groups;
};

export { listGroupsService };
