"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupService = void 0;
const prisma_1 = require("../../prisma");
const createGroupService = async ({ modulePrefixName = "module", sprintPrefixName = "sprint", }) => {
    const createSprint = (_, index) => ({
        name: `${sprintPrefixName} ${index + 1}`,
    });
    const sprintsToCreate = new Array(8).fill(null).map(createSprint);
    const sprints = { create: sprintsToCreate };
    const moduleToCreate = {
        name: `${modulePrefixName} 1`,
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
    const createdGroup = await prisma_1.prisma.groups.create({ data, include });
    return createdGroup;
};
exports.createGroupService = createGroupService;
