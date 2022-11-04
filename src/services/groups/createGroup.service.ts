import { IGroupRequest } from "../../interfaces/groups";
import { prisma } from "../../prisma";

const createGroupService = async ({
    moduleName,
    sprintName,
}: IGroupRequest) => {
    const createSprint = (_: null, index: number) => ({
        name: `${sprintName} ${index + 1}`,
    });
    const sprintsToCreate = new Array(8).fill(null).map(createSprint);
    const sprints = { create: sprintsToCreate };

    const moduleToCreate = {
        name: `${moduleName} 1`,
        sprints,
    };
    const modules = { create: moduleToCreate };

    const data = { modules };
    const include = {
        modules: {
            include: {
                sprints: true,
            },
        },
    };

    const createdGroup = await prisma.groups.create({ data, include });

    return createdGroup;
};

export { createGroupService };
