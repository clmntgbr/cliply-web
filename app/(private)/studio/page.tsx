"use client";

import { VideoQueueList } from "@/components/queue/video-queue-list";
import Upload from "@/components/upload/video-upload";

export default function StudioPage() {
  return (
    <>
      <Upload />
      <VideoQueueList />
    </>
  );
}
