export interface IVideoRequest {
  title: string;
  url: string;
  classDate: Date;
  sprintId: string;
  userId: string;
}

export interface IVideosResponse extends IVideoRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
