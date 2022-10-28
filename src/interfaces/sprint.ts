export interface ISprintRequest {
  name: string;
  moduleId: string;
}

export interface ISprintResponse extends ISprintRequest {
  id: string;
}
