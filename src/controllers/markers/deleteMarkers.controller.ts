import { RequestHandler } from "express";
import { deleteMarkersService } from "../../services/markers";

const deleteMarkersController: RequestHandler = async (req, res) => {
   const { params: { id }, user: { id: userId } } = req;

   const deleteMarker = await deleteMarkersService(id, userId);
   res.status(200).json({
    message: deleteMarker
   });
}

export { deleteMarkersController }