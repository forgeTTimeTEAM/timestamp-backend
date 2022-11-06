import { RequestHandler } from "express";
import { createModuleService } from "../../services/modules";

const createModuleController: RequestHandler = async (req, res) => {
  const module = await createModuleService(req.body);

  return res.status(201).json(module);
};

export { createModuleController };
