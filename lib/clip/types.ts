import { Hydra } from "../hydra";

export interface Video {
  name: string;
  originalName: string;
  url: string;
  duration: number;
  size: number;
  format: string;
  subtitleSrtName: string;
  audioFiles: string[];
}

export interface Clip {
  id: string;
  createdAt: string;
  originalVideo: Video;
  thumbnail: string;
  status: string;
  user: string;
  statuses: string[];
  isDownloadable: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  isProcessing: boolean;
}

export interface ClipState {
  clips: Hydra<Clip>;
  loading: boolean;
  error: string | null;
}

export interface ClipUrlRequestBody {
  url: string;
  originalName: string;
  thumbnail?: string;
}

export interface ClipVideoRequestBody {
  data: FormData;
}

export type ClipAction =
  | { type: "FETCH_CLIPS_SUCCESS"; payload: Hydra<Clip> }
  | { type: "FETCH_CLIPS_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_CLIPS" }
  | { type: "DELETE_CLIP_OPTIMISTIC"; payload: string };
