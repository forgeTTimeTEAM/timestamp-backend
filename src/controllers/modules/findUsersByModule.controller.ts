import { RequestHandler } from "express";

import { findUsersByModuleService } from "../../services/modules";

const findUsersByModuleController: RequestHandler = async (req, res) => {
  const users = await findUsersByModuleService(
    req.params.id,
    req.user.id,
    req.user.role
  );

  return res.status(200).json(users);
};

export { findUsersByModuleController };
