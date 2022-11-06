import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { v4 } from "uuid";
import { IUserLogin, IUsersRequest } from "../../interfaces/users";

export const userAdmMock: Prisma.usersCreateInput = {
  email: `lucas.jozefovicz${v4()}@mail.com`,
  name: "Lucas",
  password: hashSync("1234", 10),
  role: "ADM",
};

export const loginAdmMock: IUserLogin = {
  email: userAdmMock.email,
  password: "1234",
};

export const userStudentMock: IUsersRequest = {
  email: `student${v4()}@mail.com`,
  name: "student",
  password: "1234",
  groupId: "",
  moduleId: "",
};

export const loginStudentMock: IUserLogin = {
  email: userStudentMock.email,
  password: "1234",
};
