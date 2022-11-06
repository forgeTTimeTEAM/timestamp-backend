import { prisma } from "../../prisma";

const listModulesService = async () => {
  const module = await prisma.modules.findMany();

  return module;
};

export { listModulesService };
