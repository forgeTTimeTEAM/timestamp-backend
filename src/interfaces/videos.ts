export interface IVideoRequest {
  title: string;
  url: string | null;
  releaseDate: Date;
  sprintId: string;
}

export interface IVideoMock {
  title: string;
  url: string | null;
  releaseDate: string;
  sprintId: string;
}
