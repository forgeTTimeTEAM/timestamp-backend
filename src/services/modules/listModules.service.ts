import { prisma } from "../../prisma";

const listModulesService = async () => {
  const modules = await prisma.modules.findMany();

  return modules;
};

export { listModulesService };
