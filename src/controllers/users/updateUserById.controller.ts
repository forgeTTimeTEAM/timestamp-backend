import { RequestHandler } from "express";
import { IUserUpdateById } from "../../interfaces/users";
import { updateUserByIdService } from "../../services/users/updateUserById.service";

const updateUserById: RequestHandler = async (req, res) => {
  const userDataUpdate: IUserUpdateById = req.body;
  const { id } = req.params;

  const userUpdated = await updateUserByIdService(userDataUpdate, id);

  return res.status(200).json(userUpdated);
};

export { updateUserById };
