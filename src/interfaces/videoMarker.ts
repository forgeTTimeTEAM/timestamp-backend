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
