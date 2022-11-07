import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

import { prisma } from "../../prisma";
import { AppError } from "../../errors/AppError";
import { IUserLogin } from "../../interfaces/users";

const loginUserService = async ({ email, password }: IUserLogin) => {
  if (email.length === 0 || password.length === 0)
    throw new AppError("Wrong email or password.", 403);

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not registered.", 404);
  }

  const matchPassword = await compare(password, user.password);

  if (!matchPassword) {
    throw new AppError("Wrong email or password.", 403);
  }

  return jwt.sign(
    { role: user.role, groupId: user.groupId },
    process.env.SECRET_KEY!,
    { expiresIn: "24h", subject: user.id }
  );
};

export { loginUserService };
