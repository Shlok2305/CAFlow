import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "1h";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("FATAL: JWT_SECRET environment variable is missing.");
  }
  return secret;
};

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type RegisteredUserResponse = SafeUser;

export interface LoginResult {
  token: string;
  user: SafeUser;
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

export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
  const { email, password } = input;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // 2. Verify password with bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Generate JWT with user's ID as sub
  const jwtSecret = getJwtSecret();
  const token = jwt.sign({ sub: user.id }, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });

  // 4. Return token and safe user details
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};
