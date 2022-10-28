import { Request, Response } from "express";
import { createUserService } from "../../services/users/createUserService";

const createUserController = async (req: Request, res: Response) => {
  const user = req.body;

  const createUser = await createUserService(user);

  return res.status(201).json(createUser);
};

export { createUserController };
