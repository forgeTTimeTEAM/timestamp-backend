interface marks {
  time: string;
  title: string;
  videoId: string;
}

export interface IVideoMarkerRequest {
  marks: marks[];
  videoId: string;
  groupId: string | undefined;
}

export interface IVideoMarkerUpdade {
  id: string;
  bodyPatch: {
    time?: string;
    title?: string
  }
}

export interface IUserService {
  id: string;
  role: "STUDENT" | "ADM" | "INSTRUCTOR";
  groupId?: string;
}