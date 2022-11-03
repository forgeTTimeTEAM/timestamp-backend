import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

import { prisma } from "../../prisma";
import { AppError } from "../../errors/AppError";
import { IUserLogin } from "../../interfaces/users";

const loginUserService = async ({ email, password }: IUserLogin) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) throw new AppError("User not registered.", 404);

  const matchPassword = await compare(password, user.password);

  if (!matchPassword) throw new AppError("Wrong email/password.", 403);

  return jwt.sign(
    { role: user.role, groupId: user.groupId },
    process.env.SECRET_KEY!,
    { expiresIn: "24h", subject: user.id }
  );
};

export { loginUserService };
