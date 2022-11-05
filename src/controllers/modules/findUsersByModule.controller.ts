import { RequestHandler } from "express";

import { findUsersByModuleService } from "../../services/modules";

const findUsersByModuleController: RequestHandler = async (req, res) => {
  const users = await findUsersByModuleService({
    moduleId: req.params.id,
    userId: req.user.id,
  });

  return res.status(200).json(users);
};

export { findUsersByModuleController };
