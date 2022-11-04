import { RequestHandler } from "express";

import { findUsersByGroupService } from "../../services/users";

const findUsersByGroupController: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const users = await findUsersByGroupService(id);

  return res.status(200).json(users);
};

export { findUsersByGroupController };
