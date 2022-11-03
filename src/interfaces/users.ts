export interface IUsersRequest {
  name: string;
  email: string;
  password: string;
  groupId: string | null;
}

export interface IUserLogin {
  email: string;
  password: string;
}