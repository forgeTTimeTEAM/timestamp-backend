import { AppError } from "../../errors/AppError";
import { IVideoUpdateParams } from "../../interfaces/videos";
import { prisma } from "../../prisma";

const updateVideoService = async ({
    groupId,
    userRole,
    video,
    videoId,
}: IVideoUpdateParams) => {
    const { title, sprintId, url } = video;
    const videoExists = await prisma.videos.findUnique({
        where: {
            id: videoId,
        },
    });

    if (!sprintId) {
        throw new AppError("Sprint id is required");
    }

    const sprintExists = await prisma.sprints.findUnique({
        where: {
            id: sprintId,
        },
    });

    if (!sprintExists) {
        throw new AppError("Sprint not found", 404);
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
                                id: sprintId,
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

    if (!videoExists) {
        throw new AppError("Video not found", 404);
    }

    const updatedUser = await prisma.videos.update({
        where: {
            id: videoId,
        },
        data: {
            title: title || videoExists.title,
            url: url || videoExists.url,
        },
    });
    return updatedUser
};

export { updateVideoService };
