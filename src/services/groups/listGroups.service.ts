import { prisma } from "../../prisma";

import { removeObjectProperty } from "../../utils";

const listGroupsService = async () => {
  const groups = await prisma.groups.findMany({
    include: {
      modules: true,
      users: true,
    },
  });

  groups.forEach((group) => {
    if (group.users.length) {
      group.users.forEach((user) => {
        removeObjectProperty(user, "password");
      });
    }
  });

  return groups;
};

export { listGroupsService };
