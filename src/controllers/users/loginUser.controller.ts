import { RequestHandler } from "express";

import { loginUserService } from "../../services/users/loginUser.service";

const loginUserController: RequestHandler = async (req, res) => {
  const token = await loginUserService(req.body);

  return res.status(200).json({ token });
};

export { loginUserController };
