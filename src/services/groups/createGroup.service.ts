import { prisma } from "../../prisma";

import { IGroupRequest } from "../../interfaces/groups";

import { handleSequencialObject } from "../../utils";

const createGroupService = async ({
  modulePrefixName = "module",
  sprintPrefixName = "sprint",
}: IGroupRequest) => {
  const sprintsToCreate = handleSequencialObject("name", 8, sprintPrefixName);
  const sprints = { create: sprintsToCreate };

  const moduleToCreate = {
    name: `${modulePrefixName}1`,
    sprints,
  };
  const modules = { create: moduleToCreate };

  const createdGroup = await prisma.groups.create({
    data: {
      modules,
    },
    include: {
      modules: {
        include: {
          sprints: true,
        },
      },
    },
  });

  return createdGroup;
};

export { createGroupService };
