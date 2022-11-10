import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { v4 } from "uuid";
import { IUserLogin, IUsersRequest } from "../../interfaces/users";

export const admUserMock: Prisma.usersCreateInput = {
  email: `adm@mail.com`,
  name: "Adm",
  password: hashSync("1234", 10),
  role: "ADM",
};

export const instructorUserMock: Prisma.usersCreateInput = {
  email: `instructor@mail.com`,
  name: "Instructor",
  password: hashSync("1234", 10),
  role: "INSTRUCTOR",
};

export const studentUserMock: IUsersRequest = {
  email: `student@mail.com`,
  name: "Student",
  password: "1234",
  groupId: "",
  moduleId: "",
};

export const admLoginMock: IUserLogin = {
  email: admUserMock.email,
  password: "1234",
};

export const loginInstructorMock: IUserLogin = {
  email: instructorUserMock.email,
  password: "1234",
};

export const loginStudentMock: IUserLogin = {
  email: studentUserMock.email,
  password: "1234",
};
