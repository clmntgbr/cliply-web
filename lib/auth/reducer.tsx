import { AuthAction, AuthState } from "./types";

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case "REGISTER_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
