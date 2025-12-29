"use client";

import { createContext, useContext } from "react";
import { AuthState, LoginPayload, RegisterPayload } from "./types";

export interface AuthContextType extends AuthState {
  handleLogin: (payload: LoginPayload) => Promise<void>;
  handleRegister: (payload: RegisterPayload) => Promise<void>;
  handleLogout: () => Promise<void>;
  requireAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
