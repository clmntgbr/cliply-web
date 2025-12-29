import { User } from "../user/types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_ERROR"; payload: string }
  | { type: "SET_IS_LOADING"; payload: boolean };

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}
