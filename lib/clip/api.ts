import { Hydra } from "../hydra";
import { QueryParams } from "./provider";
import { Clip, ClipUrlRequestBody, ClipVideoRequestBody } from "./types";

export const fetchClips = async (queryParams: QueryParams): Promise<Hydra<Clip>> => {
  const query = new URLSearchParams();

  query.append("itemsPerPage", "10");
  query.append("page", queryParams.page.toString());

  if (queryParams.search) {
    query.append("originalFileName", queryParams.search);
  }

  if (queryParams.from) {
    query.append("createdAt[after]", queryParams.from.toISOString());
  }

  if (queryParams.to) {
    query.append("createdAt[before]", queryParams.to.toISOString());
  }

  const status = [...(queryParams.status || []), "!deleted"];
  query.append("status", status.join(","));

  const response = await fetch(`/api/clips?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch clips");
  }

  return response.json();
};

export const downloadClip = async (id: string, fileName: string): Promise<void> => {
  const response = await fetch(`/api/clips/${id}/download`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to download clip");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const createClipUrl = async (data: ClipUrlRequestBody): Promise<Response> => {
  const response = await fetch(`/api/clips/url`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create clip url");
  }

  return response;
};

export const createClipVideo = async (form: ClipVideoRequestBody): Promise<Response> => {
  const response = await fetch(`/api/clips/video`, {
    method: "POST",
    body: form.data,
  });

  if (!response.ok) {
    throw new Error("Failed to create clip file");
  }

  return response;
};

export const deleteClip = async (id: string): Promise<Response> => {
  const response = await fetch(`/api/clips/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete clip");
  }

  return response;
};
