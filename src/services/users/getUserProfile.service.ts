import { prisma } from "../../prisma";

import { removeObjectProperty } from "../../utils/removeObjectProperty";

const getUserProfileService = async (id: string) => {
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

  removeObjectProperty(user!, "password");

  return user;
};

export { getUserProfileService };
