import { RequestHandler } from "express";

import { listUsersService } from "../../services/users/listUsers.service";

const listUsersController: RequestHandler = async (req, res) => {
  const users = await listUsersService();

  return res.status(200).json(users);
};

export { listUsersController };
