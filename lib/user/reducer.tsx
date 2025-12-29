import { UserAction, UserState } from "./types";

export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};
