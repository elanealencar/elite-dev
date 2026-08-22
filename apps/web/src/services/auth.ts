import type { LoginResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LoginInput = {
  email: string;
  password: string;
};

export async function loginRequest(
  data: LoginInput
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message ?? "Não foi possível entrar"
    );
  }

  return responseData;
}