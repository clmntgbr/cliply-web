"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getMe } from "./api";
import { UserContext } from "./context";
import { userReducer } from "./reducer";
import { UserState } from "./types";

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const handleFetchMe = useCallback(async () => {
    try {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      const user = await getMe();
      dispatch({ type: "SET_USER", payload: user });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch user" });
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }, []);

  const handleClearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
  }, []);

  useEffect(() => {
    handleFetchMe();
  }, [handleFetchMe]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        handleFetchMe,
        handleClearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
