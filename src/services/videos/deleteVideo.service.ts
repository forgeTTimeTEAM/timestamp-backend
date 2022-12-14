import { AppError } from "../../errors/AppError";
import { IVideoUpdateParams } from "../../interfaces/videos";
import { prisma } from "../../prisma";

const deleteVideoService = async ({
    groupId,
    userRole,
    video,
    videoId,
}: IVideoUpdateParams) => {
    const videoExists = await prisma.videos.findFirst({
        where: {
            id: videoId,
        },
    });

    if (!videoExists) {
        throw new AppError("Video not found", 404);
    }

    if (userRole === "INSTRUCTOR" && !groupId) {
        throw new AppError("Instructor not allowed", 401);
    }

    if (userRole === "INSTRUCTOR" && groupId) {
        const findInstructor = await prisma.groups.findUnique({
            where: {
                id: groupId,
            },
            include: {
                modules: {
                    include: {
                        sprints: {
                            where: {
                                id: video.sprintId,
                            },
                        },
                    },
                },
            },
        });

        if (!findInstructor) {
            throw new AppError("Instructor not allowed", 401);
        }
    }

    await prisma.videos.update({
        where: {
            id: videoId,
        },
        data: {
            url: null,
        },
    });
};

export { deleteVideoService };
