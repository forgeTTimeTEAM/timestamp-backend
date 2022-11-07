import { RequestHandler } from "express";

import { findUserProfileService } from "../../services/users";

const findUserProfileController: RequestHandler = async (req, res) => {
  const userFound = await findUserProfileService(req.user.id);

  return res.status(200).json(userFound);
};

export { findUserProfileController };
