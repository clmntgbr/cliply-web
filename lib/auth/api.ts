import { User } from "../user/types";
import { LoginPayload, RegisterPayload } from "./types";

export const login = async (payload: LoginPayload): Promise<{ user: User; token: string }> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.key || "Login failed");
  }

  return response.json();
};

export const register = async (payload: RegisterPayload): Promise<{ user: User; token: string }> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.key || "Registration failed");
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
};
