export type Role = "ADM" | "INSTRUCTOR" | "STUDENT";

export interface IUsersRequest {
  name: string;
  email: string;
  password: string;
  groupId: string;
  moduleId: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserUpdateById {
  name?: string;
  groupId?: string;
}
