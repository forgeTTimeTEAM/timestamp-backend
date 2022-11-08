import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { v4 } from "uuid";
import { IUserLogin, IUsersRequest } from "../../interfaces/users";

export const admUserMock: Prisma.usersCreateInput = {
    email: `adm.${v4()}@mail.com`,
    name: "Adm",
    password: hashSync("1234", 10),
    role: "ADM",
};

export const instructorUserMock: Prisma.usersCreateInput = {
    email: `instructor.${v4()}@mail.com`,
    name: "Instructor",
    password: hashSync("1234", 10),
    role: "INSTRUCTOR",
};

export const studentUserMock: IUsersRequest = {
    email: `student.${v4()}@mail.com`,
    name: "Student",
    password: "1234",
    groupId: "",
    moduleId: "",
};

export const loginAdmMock: IUserLogin = {
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
