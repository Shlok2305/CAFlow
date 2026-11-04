import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { RegisterInput } from "./auth.validation.js";

const SALT_ROUNDS = 10;

export interface RegisteredUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export const registerUser = async (
  input: RegisterInput
): Promise<RegisteredUserResponse> => {
  const { name, email, password } = input;

  // 1. Check if user already exists with this email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Create user in database with hashed password
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Email is already registered", 409);
    }
    throw error;
  }
};
