import { RequestHandler } from "express";

import { listModulesService } from "../../services/modules/listModules.service";

const listModulesController: RequestHandler = async (req, res) => {
  const modules = await listModulesService();

  return res.status(200).json(modules);
};

export { listModulesController };
