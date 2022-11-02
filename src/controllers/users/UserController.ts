import { Request, Response } from "express";

import {
  createUserService,
  findUsersByGroupService,
} from "../../services/users/UserService";

const createUserController = async (req: Request, res: Response) => {
  const user = req.body;

  const createdUser = await createUserService(user);

  return res.status(201).json(createdUser);
};

const findUsersByGroupController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const users = await findUsersByGroupService(id);

  return res.status(200).json(users);
};

export { createUserController, findUsersByGroupController };
