import { RequestHandler } from "express";

import { createUserService } from "../../services/users";

const createUserController: RequestHandler = async (req, res) => {
  const createdUser = await createUserService(req.body);

  return res.status(201).json(createdUser);
};

export { createUserController };
