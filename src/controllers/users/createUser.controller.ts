import { RequestHandler } from "express";

import { createUserService } from "../../services/users";

const createUserController: RequestHandler = async (req, res) => {
  const user = req.body;

  const createdUser = await createUserService(user);

  return res.status(201).json(createdUser);
};

export { createUserController };
