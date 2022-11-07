import { RequestHandler } from "express";

import { listGroupsService } from "../../services/groups";

const listGroupsController: RequestHandler = async (req, res) => {
  const groups = await listGroupsService();

  return res.status(200).json(groups);
};

export { listGroupsController };
