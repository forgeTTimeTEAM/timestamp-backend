import { RequestHandler } from "express";
import { getUserProfileService } from "../../services/users";

const getUserProfileController: RequestHandler = async (req, res) => {
  const userFound = await getUserProfileService(req.user.id);

  return res.status(200).json(userFound);
};

export { getUserProfileController };
