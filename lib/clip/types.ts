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
  originalVideo: Video;
  thumbnail: string;
  status: string;
  user: string;
  statuses: string[];
}

export interface ClipState {
  clips: Hydra<Clip>;
  loading: boolean;
  error: string | null;
}

export interface ClipUrlRequestBody {
  url: string;
  name: string;
  thumbnail_file?: string;
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
