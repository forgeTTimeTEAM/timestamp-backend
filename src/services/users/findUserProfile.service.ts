import { prisma } from "../../prisma";

import { removeObjectProperty } from "../../utils/removeObjectProperty";

const findUserProfileService = async (id: string) => {
  const videos = {
    include: {
      video_markers: true,
    },
  };

  const sprints = {
    include: {
      videos,
    },
  };

  const module = {
    include: {
      sprints,
    },
  };

  const user = await prisma.users.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          module,
        },
      },
      group: true,
    },
  });

  return removeObjectProperty(user!, "password");
};

export { findUserProfileService };
