import { RequestHandler } from "express";
import { createGroupService } from "../../services/groups";

const createGroupController: RequestHandler = async (req, res) => {
  const group = await createGroupService(req.body);

  return res.status(201).json(group);
};

export { createGroupController };
