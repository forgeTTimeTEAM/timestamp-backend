import { RequestHandler } from "express"
import { deleteVideoService } from "../../services/videos/deleteVideo.service"

const deleteVideoController: RequestHandler = async (req, res) => {
    const id = req.params.id
    deleteVideoService(id)

    return res.status(204).send()
}

export { deleteVideoController }