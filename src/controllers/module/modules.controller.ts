import { Request, Response } from "express";
import { listModulesService } from "../../services/modules/listModules.service";

const listModulesController = async (req: Request, res: Response) => {
  const listModules = await listModulesService();

  return res.status(200).json(listModules);
};

export { listModulesController };
