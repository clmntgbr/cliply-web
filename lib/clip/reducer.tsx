import { ClipAction, ClipState } from "./types";

export const clipReducer = (state: ClipState, action: ClipAction): ClipState => {
  switch (action.type) {
    case "FETCH_CLIPS_SUCCESS":
      return {
        ...state,
        clips: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_CLIPS_ERROR":
      return {
        ...state,
        clips: {
          member: [],
          totalItems: 0,
          currentPage: 0,
          itemsPerPage: 0,
          totalPages: 0,
        },
        loading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "CLEAR_CLIPS":
      return {
        ...state,
        clips: {
          member: [],
          totalItems: 0,
          currentPage: 0,
          itemsPerPage: 0,
          totalPages: 0,
        },
        loading: false,
        error: null,
      };
    case "DELETE_CLIP_OPTIMISTIC":
      return {
        ...state,
        clips: {
          ...state.clips,
          member: state.clips.member.filter((clip) => clip.id !== action.payload),
          totalItems: Math.max(0, state.clips.totalItems - 1),
        },
      };
    default:
      return state;
  }
};
