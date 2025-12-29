import z from "zod";

export const YoutubeUrlSchema = z.string().refine(
  (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/).+/i;
    return youtubeRegex.test(url);
  },
  { message: "Invalid YouTube URL" },
);
