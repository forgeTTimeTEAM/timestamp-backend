import { prisma } from "../../prisma";

import { AppError } from "../../errors/AppError";
import { IVideoMarkerUpdade } from "../../interfaces/videoMarker";

const updateMarkerService = async ({ id, bodyPatch }: IVideoMarkerUpdade) => {
  const marker = await prisma.video_markers.findFirst({
    where: {
      id
    },
    include: {
      video: true
    }
  });

  console.log(marker);
}

export { updateMarkerService }