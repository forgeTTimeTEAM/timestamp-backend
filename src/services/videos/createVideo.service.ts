import { Role } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { IVideoRequest } from "../../interfaces/videos";
import { prisma } from "../../prisma";

const createVideoService = async (
    groupId: string,
    userRole: Role,
    { title, url = null, releaseDate, sprintId }: IVideoRequest
) => {
    if (!title) {
        throw new AppError("Title is required");
    }

    if (!releaseDate) {
        throw new AppError("Release date is required");
    }

    if (!sprintId) {
        throw new AppError("Sprint id is required");
    }

    const sprintExists = await prisma.sprints.findFirst({
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

    if (url) {
        const videoExists = await prisma.videos.findFirst({
            where: {
                url,
            },
        });

        if (videoExists) {
            throw new AppError("This video already exists");
        }
    }

    const createdVideo = await prisma.videos.create({
        data: {
            title,
            releaseDate: new Date(releaseDate),
            url: url || null,
            sprintId,
        },
    });

    return createdVideo;
};

export { createVideoService };
