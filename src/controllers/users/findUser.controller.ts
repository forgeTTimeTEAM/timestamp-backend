import { RequestHandler } from "express";
import { findUserService } from "../../services/users";

const findUserController: RequestHandler = async (req, res) => {
  const user = await findUserService(req.params.id);

  return res.status(200).json(user);
};

export { findUserController };
