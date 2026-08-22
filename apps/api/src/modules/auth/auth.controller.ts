import type { Request, Response } from "express";
import {
  loginService,
  registerService,
} from "./auth.service.js";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(
  request: Request,
  response: Response
) {
  try {
    const user = await registerService(request.body);

    return response.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      return response.status(409).json({
        message: "Email already registered",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(
  request: Request,
  response: Response
) {
  try {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Invalid login data",
      });
    }

    const { email, password } = parsed.data;

    const result = await loginService(email, password);

    return response.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return response.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}