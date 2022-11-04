import { prisma } from "../../prisma";

const listModulesService = async () => {
  const module = await prisma.modules.findMany();
  console.log(module);
  return module;
};

export { listModulesService };
