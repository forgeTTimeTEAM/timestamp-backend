export interface IVideoMarkerRequest {
  time: string;
  title: string;
  videoId: string;
}

export interface IVideoMarkerResponse extends IVideoMarkerRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
