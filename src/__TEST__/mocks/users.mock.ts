import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { IUserLogin, IUsersRequest } from "../../interfaces/users";

export const userAdmMock: Prisma.usersCreateInput = {
  email: "lucas.jozefovicz@mail.com",
  name: "Lucas",
  password: hashSync("1234", 10),
  role: "ADM",
};

export const loginAdmMock: IUserLogin = {
  email: "lucas.jozefovicz@mail.com",
  password: "1234",
};

export const userStudentMock: IUsersRequest = {
  email: "student@mail.com",
  name: "student",
  password: "1234",
  groupId: "",
  moduleId: "",
};

export const loginStudentMock: IUserLogin = {
  email: "student@mail.com",
  password: "1234",
};
