import { prisma } from "../../prisma";

import { AppError } from "../../errors/AppError";
import { IVideoMarkerUpdade } from "../../interfaces/videoMarker";

const updateMarkerService = async ({ id, bodyPatch }: IVideoMarkerUpdade, idUser: string) => {
  const marker = await prisma.video_markers.findFirst({
    where: {
      id
    },
    include: {
      video: {
        include: {
          sprint: {
            include: {
              module: {
                include: {
                  group: {
                    include: {
                      users: true
                    }
                  }
                }
              }
            }
          },
          video_markers: {
            include: {
              video: true
            }
          }
        }
      }
    }
  });

  if (!marker) throw new AppError("Marker not found", 404);

  const isInstructor = marker.video.sprint.module.group.users.find(
    (user) => user.id === idUser
  );

  if (!isInstructor)
    throw new AppError("Instructor does not own this mark", 401);

  if(marker && bodyPatch.time && marker?.video.video_markers.find((videoMarker => videoMarker.time.localeCompare(bodyPatch.time!) === 0))) {
    throw new AppError("Time already exists", 403);
  }

  const markerUpdate = await prisma.video_markers.update({
    where: {
      id
    },
    data: { ...bodyPatch }
  });

  return markerUpdate
}

export { updateMarkerService }