import { RequestHandler } from "express";

import { findGroupByIdService } from "../../services/groups/findGroupById.service";

const findGroupByIdController: RequestHandler = async (req, res) => {
  const group = await findGroupByIdService(req.params.id);

  return res.status(200).json(group);
};

export { findGroupByIdController };
