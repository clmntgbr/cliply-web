"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer } from "react";
import { login, logout, register } from "./api";
import { AuthContext } from "./context";
import { authReducer } from "./reducer";
import { AuthState, LoginPayload, RegisterPayload } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "SET_IS_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }, []);

  const handleLogin = useCallback(
    async (payload: LoginPayload) => {
      try {
        dispatch({ type: "SET_IS_LOADING", payload: true });
        const data = await login(payload);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: data,
        });

        router.push("/studio");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        dispatch({ type: "LOGIN_ERROR", payload: message });
      }
    },
    [router]
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      try {
        dispatch({ type: "SET_IS_LOADING", payload: true });
        const data = await register(payload);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({
          type: "REGISTER_SUCCESS",
          payload: data,
        });

        router.push("/studio");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        dispatch({ type: "REGISTER_ERROR", payload: message });
      }
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  }, [router]);

  const requireAuth = useCallback(() => {
    if (!state.token && !state.isLoading) {
      router.push("/login");
    }
  }, [state.token, state.isLoading, router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        handleLogin,
        handleRegister,
        handleLogout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
