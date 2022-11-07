import { RequestHandler } from "express";

import { findUsersByGroupService } from "../../services/users";

const findUsersByGroupController: RequestHandler = async (req, res) => {
  const users = await findUsersByGroupService(req.params.id);

  return res.status(200).json(users);
};

export { findUsersByGroupController };
