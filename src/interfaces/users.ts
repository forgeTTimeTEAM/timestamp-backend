export interface IUsersRequest {
  name: string;
  email: string;
  password: string;
  modulesId: string;
  isAdmin?: boolean;
}

export interface IUsersResponse extends IUsersRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
