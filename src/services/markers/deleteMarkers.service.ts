import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma";

const deleteMarkersService = async (idMarker: string, idUser: string) => {
  const marker = await prisma.video_markers.findFirst({
    where: {
      id: idMarker
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
          }
        }
      }
    }
  })

  if (!marker) throw new AppError("Marker not found", 404);

  const isInstructor = marker?.video.sprint.module.group.users.find(user => user.id === idUser)

  if (!isInstructor) throw new AppError("Instructor does not own this mark", 401)
  


  const markerDelete = await prisma.video_markers.delete({
    where: {
      id: idMarker
    }
  });

  if (!markerDelete) throw new AppError("Marker not found", 404);
  
  return "Mark deleted."
}

export { deleteMarkersService };