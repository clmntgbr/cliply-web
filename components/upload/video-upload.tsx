"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import VideoPreview from "./video-preview";
import { YoutubeUrlSchema } from "./youtube-url-validation";

// Supported video formats
const SUPPORTED_VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

export default function VideoUpload() {
  const [url, setUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const isValidVideo = SUPPORTED_VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext)) || file.type.startsWith("video/");

      if (isValidVideo) {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    });

    // Reset input to allow selecting the same file again
    event.target.value = "";
  };

  const handlePreviewOpenChange = (open: boolean) => {
    setIsPreviewOpen(open);
    if (!open) {
      setSelectedFile(null);
      setUrl("");
    }
  };

  const handleProcessSuccess = () => {
    setSelectedFile(null);
    setUrl("");
    setUrlInput("");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const isValidVideo = SUPPORTED_VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext)) || file.type.startsWith("video/");

      if (isValidVideo) {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      } else {
        toast.error("Invalid file type", {
          description: `Please drop a video file (${SUPPORTED_VIDEO_EXTENSIONS.join(", ").toUpperCase()})`,
        });
      }
    });
  };
  const handleUrlSubmit = () => {
    try {
      YoutubeUrlSchema.parse(urlInput);
      setUrl(urlInput);
      setIsPreviewOpen(true);
      setUrlInput("");
    } catch {
      toast.error("Invalid YouTube URL", {
        description: "Please enter a valid YouTube URL",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-2xl max-w-full mx-auto h-[80vh] justify-center">
      <div className="relative mb-4 flex flex-col items-center px-4 text-center md:mb-6">
        <h1 className="mb-2 flex items-center gap-1 text-3xl font-bold leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl">
          <span className="pt-0.5 tracking-tight md:pt-0">Build video clips</span>
        </h1>
        <p className="mb-6 max-w-[25ch] text-center text-lg leading-tight md:max-w-full md:text-xl">Create viral video clips with AI</p>
      </div>
      <div className="relative">
        <div
          className={`relative flex min-h-52 flex-col items-center justify-center overflow-hidden  border p-4 transition-all duration-200`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input id="file-input" type="file" multiple className="hidden" accept=".mp4,.mov,.avi,.mkv,.webm" onChange={handleFileSelect} />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className={`mb-2 flex size-11 shrink-0 items-center justify-center border transition-all duration-200 rounded-full`}
              aria-hidden="true"
            >
              <HugeiconsIcon icon={Image01Icon} className={`size-4 transition-colors duration-200 opacity-60`} />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your video here</p>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI, MKV, WEBM (max. 1GB)</p>
            <Button className="mt-4" onClick={() => document.getElementById("file-input")?.click()}>
              <HugeiconsIcon icon={Upload01Icon} className="-ms-1 size-4 opacity-60 mr-2" aria-hidden="true" />
              Select video
            </Button>
          </div>
        </div>
      </div>
      <div className="flex shadow-none">
        <Input
          id="youtube-url-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUrlSubmit();
            }
          }}
          className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 font-medium placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="https://www.youtube.com/watch?v=aX3z61QftVY"
          type="url"
        />
        <Button onClick={handleUrlSubmit}>Upload from URL</Button>
      </div>
      <VideoPreview
        open={isPreviewOpen}
        onOpenChange={handlePreviewOpenChange}
        file={selectedFile}
        url={url}
        onProcessSuccess={handleProcessSuccess}
      />
    </div>
  );
}
