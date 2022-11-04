import { RequestHandler } from "express";
import { loginUserService } from "../../services/users/loginUser.service";

const loginUserController: RequestHandler = async (req, res) => {
  const { body } = req;

  const token = await loginUserService(body);

  return res.status(200).json({ token });
}

export { loginUserController }