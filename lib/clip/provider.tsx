"use client";

import { useCallback, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { createClipUrl, createClipVideo, deleteClip, downloadClip, fetchClips } from "./api";
import { ClipContext } from "./context";
import { clipReducer } from "./reducer";
import { ClipState, ClipUrlRequestBody, ClipVideoRequestBody } from "./types";

export interface QueryParams {
  page: number;
  search?: string;
  from?: Date;
  to?: Date;
  status?: string[];
}

const initialState: ClipState = {
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

export function ClipProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(clipReducer, initialState);

  const handleFetchClips = useCallback(async (params: QueryParams) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const clips = await fetchClips(params);

      dispatch({ type: "FETCH_CLIPS_SUCCESS", payload: clips });
    } catch {
      dispatch({
        type: "FETCH_CLIPS_ERROR",
        payload: "Failed to fetch clips",
      });
    }
  }, []);

  const handleDownloadClip = useCallback(async (id: string, fileName: string) => {
    try {
      toast.info("Clip will be downloaded shortly");
      await downloadClip(id, fileName);
      toast.success("Clip downloaded successfully");
    } catch {
      toast.error("Failed to download clip");
    }
  }, []);

  const handleCreateClipUrl = useCallback(async (data: ClipUrlRequestBody): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await createClipUrl(data);
      const result = await response.json();

      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("Clip created successfully");

      return result;
    } catch {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to create clip");
    }
  }, []);

  const handleCreateClipVideo = useCallback(async (data: ClipVideoRequestBody): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await createClipVideo(data);
      const result = await response.json();

      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("Clip video created successfully");

      return result;
    } catch {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to create clip video");
    }
  }, []);

  const handleDeleteClip = useCallback(async (id: string): Promise<void> => {
    try {
      dispatch({ type: "DELETE_CLIP_OPTIMISTIC", payload: id });

      const response = await deleteClip(id);
      const result = await response.json();

      toast.success("Clip video deleted successfully");

      return result;
    } catch {
      toast.error("Failed to delete clip video");
    }
  }, []);

  const handleClearClip = useCallback(() => {
    dispatch({ type: "CLEAR_CLIPS" });
  }, []);

  useEffect(() => {
    handleFetchClips({ page: 1 });
  }, [handleFetchClips]);

  return (
    <ClipContext.Provider
      value={{
        ...state,
        handleFetchClips,
        handleDownloadClip,
        handleCreateClipUrl,
        handleCreateClipVideo,
        handleDeleteClip,
        handleClearClip,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
}
