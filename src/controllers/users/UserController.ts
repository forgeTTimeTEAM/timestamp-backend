import { Request, Response } from "express";
import {
  createUserService,
  findUserService,
} from "../../services/users/UserService";

const createUserController = async (req: Request, res: Response) => {
  const user = req.body;

  const createUser = await createUserService(user);

  return res.status(201).json(createUser);
};

const findManyUserController = async (req: Request, res: Response) => {
  const users = await findUserService();

  return res.status(200).json(users);
};

export { createUserController, findManyUserController };
