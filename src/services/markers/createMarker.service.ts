import { prisma } from "../../prisma";

import { AppError } from "../../errors/AppError";

import { IVideoMarkerRequest } from "../../interfaces/videoMarker";

const createMarkerServices = async ({
  marks,
  groupId,
  videoId,
}: IVideoMarkerRequest) => {

  console.log(marks)
  
  if (!marks[0].videoId) {
    throw new AppError("video should be send");
  }

  marks.map((marks) => {
    if (marks.title === undefined) {
      throw new AppError("title should be provided");
    }
  });

  marks.map((marks) => {
    if (marks.videoId !== videoId) {
      throw new AppError("this video needed to equal marks video");
    }
  });

  const videoExists = await prisma.videos.findFirst({
    where: {
      id: marks[0].videoId,
    },
    include: {
      sprint: {
        include: {
          module: {
            include: {
              group: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      video_markers: true,
    },
  });

  if (!videoExists) {
    throw new AppError("video not found", 404);
  }

  if (videoExists.sprint.module.group.id !== groupId) {
    throw new AppError(
      "must be an instructor in this module to add marks",
      401
    );
  }

  const timeValidate = /((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9])$/;

  marks.map((marker) => {
    if (!timeValidate.test(marker.time)) {
      throw new AppError("time not validate");
    }
  });

  const timeExists = videoExists.video_markers.map((marker) => {
    marks.map((markReq) => {
      markReq.time.includes(marker.time);
    });
  });

  if (timeExists.length > 0) {
    throw new AppError("timer already exists");
  }

  try {
    const created = await prisma.video_markers.createMany({
      data: marks,
    });

    return created;
  } catch (err: any) {
    throw new AppError(err);
  }
};

export { createMarkerServices };
