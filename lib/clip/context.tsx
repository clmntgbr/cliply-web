"use client";

import { createContext, useContext } from "react";
import { QueryParams } from "./provider";
import { ClipState, ClipUrlRequestBody, ClipVideoRequestBody } from "./types";

export interface ClipContextType extends ClipState {
  handleFetchClips: (params: QueryParams) => Promise<void>;
  handleDownloadClip: (id: string, fileName: string) => Promise<void>;
  handleCreateClipUrl: (data: ClipUrlRequestBody) => Promise<void>;
  handleCreateClipVideo: (data: ClipVideoRequestBody) => Promise<void>;
  handleDeleteClip: (id: string) => Promise<void>;
  handleClearClip: () => void;
}

export const ClipContext = createContext<ClipContextType | undefined>(undefined);

export const useClips = () => {
  const context = useContext(ClipContext);
  if (!context) {
    throw new Error("useClips must be used within ClipProvider");
  }
  return context;
};
