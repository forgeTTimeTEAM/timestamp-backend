import { RequestHandler } from "express";
import { deleteUserService } from "../../services/users";

const deleteUserController: RequestHandler = async (req, res) => {
  await deleteUserService(req.params.id);

  return res.status(204).send();
};

export { deleteUserController };
