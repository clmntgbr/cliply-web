import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClips } from "@/lib/clip/context";
import {
  Cancel01Icon,
  Clock01Icon,
  Film01Icon,
  HardDriveIcon,
  Loading03Icon,
  Playlist01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import VideoSettings from "./video-settings";

interface VideoPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  url: string | null;
  onProcessSuccess?: () => void;
}

export const VideoPreview = ({
  open,
  onOpenChange,
  file,
  url,
  onProcessSuccess,
}: VideoPreviewProps) => {
  const { handleCreateClipVideo, handleCreateClipUrl } = useClips();
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState<string>("--:--");
  const [fileSize, setFileSize] = useState<string>("-- MB");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useHotkeys("meta+e", () => {
    if ((url || file) && !isProcessing) {
      handleProcessVideo();
    }
  });

  useHotkeys("meta+j", () => {
    if ((url || file) && !isProcessing) {
      setIsSettingsOpen(!isSettingsOpen);
    }
  });

  useEffect(() => {
    if (url) {
      loadYoutubeMetadata(url);
    }
    if (file) {
      loadFileMetadata(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, url]);

  const loadFileMetadata = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = fileUrl;
    video.muted = true;
    video.crossOrigin = "anonymous";

    setVideoTitle(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");

    const captureFrame = () => {
      const totalSeconds = Math.floor(video.duration);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formattedDuration =
        hours > 0
          ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          : `${minutes}:${seconds.toString().padStart(2, "0")}`;

      setDuration(formattedDuration);

      const randomTime = video.duration * (0.1 + Math.random() * 0.8);
      video.currentTime = randomTime;
    };

    const onSeeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        setThumbnail(thumbnailUrl);
      }

      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", captureFrame);
      URL.revokeObjectURL(fileUrl);
    };

    video.addEventListener("loadedmetadata", captureFrame);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", captureFrame);
      video.removeEventListener("seeked", onSeeked);
      URL.revokeObjectURL(fileUrl);
    };
  };

  const loadYoutubeMetadata = async (url: string) => {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(
          url
        )}&format=json`
      );
      if (!response.ok) {
        setThumbnail(null);
        setVideoTitle("");
        setDuration("--:--");
        setFileSize("-- MB");
        return;
      }
      const data = (await response.json()) as {
        thumbnail_url: string;
        title: string;
        author_name: string;
      };

      const processedThumbnail = await processThumbnail(data.thumbnail_url);
      setThumbnail(processedThumbnail);
      setVideoTitle(data.title);
      setDuration("--:--");
      setFileSize("-- MB");
    } catch {
      setThumbnail(null);
      setVideoTitle("");
      setDuration("--:--");
      setFileSize("-- MB");
    }
  };

  const processThumbnail = async (thumbnailUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(thumbnailUrl);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let topBar = 0;
        let bottomBar = canvas.height;

        for (let y = 0; y < canvas.height; y++) {
          let isBlackRow = true;
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            if (r > 20 || g > 20 || b > 20) {
              isBlackRow = false;
              break;
            }
          }
          if (!isBlackRow) {
            topBar = y;
            break;
          }
        }

        for (let y = canvas.height - 1; y >= 0; y--) {
          let isBlackRow = true;
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            if (r > 20 || g > 20 || b > 20) {
              isBlackRow = false;
              break;
            }
          }
          if (!isBlackRow) {
            bottomBar = y;
            break;
          }
        }

        if (topBar > 0 || bottomBar < canvas.height) {
          const croppedHeight = bottomBar - topBar + 1;
          const croppedCanvas = document.createElement("canvas");
          const croppedCtx = croppedCanvas.getContext("2d");

          if (croppedCtx) {
            croppedCanvas.width = canvas.width;
            croppedCanvas.height = croppedHeight;

            croppedCtx.drawImage(
              canvas,
              0,
              topBar,
              canvas.width,
              croppedHeight,
              0,
              0,
              canvas.width,
              croppedHeight
            );

            resolve(croppedCanvas.toDataURL("image/jpeg", 0.9));
            return;
          }
        }

        resolve(thumbnailUrl);
      };

      img.onerror = () => {
        resolve(thumbnailUrl);
      };

      img.src = thumbnailUrl;
    });
  };

  const handleProcessVideo = async () => {
    if (!file && !url) {
      toast.error("No file or URL provided");
      return;
    }

    try {
      setIsProcessing(true);

      if (file) {
        const formData = new FormData();
        formData.append("video", file as Blob);

        if (thumbnail) {
          const response = await fetch(thumbnail);
          const blob = await response.blob();
          formData.append("thumbnail", blob, "thumbnail.jpg");
        }

        await handleCreateClipVideo({ data: formData });
      }

      if (url) {
        const requestBody: {
          url: string;
          originalName: string;
          thumbnail?: string;
        } = {
          url: url,
          originalName: videoTitle,
        };

        if (thumbnail) {
          requestBody.thumbnail = thumbnail;
        }

        await handleCreateClipUrl(requestBody);
      }

      if (onProcessSuccess) {
        onProcessSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error processing video:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(newOpen) => {
          if (!isProcessing) {
            onOpenChange(newOpen);
          }
        }}
      >
        <SheetContent
          side="top"
          className="max-w-[100vw] w-screen"
          style={{ height: "100vh" }}
        >
          <SheetHeader className="px-4 pt-6 pb-4 border-b gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => !isProcessing && onOpenChange(false)}
              disabled={isProcessing}
              className="absolute right-4 h-11 w-11 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-black dark:text-white hover:text-black dark:hover:text-white backdrop-blur-md border border-black/20 dark:border-white/10 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-50"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
            </Button>
            <SheetTitle>{videoTitle}</SheetTitle>
            <SheetDescription className="flex flex-row gap-2">
              <Badge variant="outline">
                <HugeiconsIcon icon={Film01Icon} className="h-3 w-3 mr-1" />
                video/mp4
              </Badge>
              <Badge variant="default">
                <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3 mr-1" />
                {duration}
              </Badge>
              <Badge variant="secondary">
                <HugeiconsIcon icon={HardDriveIcon} className="h-3 w-3 mr-1" />
                {fileSize}
              </Badge>
            </SheetDescription>
          </SheetHeader>
          <div className="relative h-full w-full flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl aspect-video rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />

              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
          </div>
          <SheetFooter>
            <div className="backdrop-blur-xl px-6 py-4">
              <div className="flex justify-center gap-3 mx-auto">
                <Button
                  onClick={() => setIsSettingsOpen(true)}
                  variant="outline"
                  disabled={isProcessing}
                  className="cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    className="h-3 w-3 mr-2"
                  />
                  Settings
                  <KbdGroup className="ml-2">
                    <Kbd>⌘ + j</Kbd>
                  </KbdGroup>
                </Button>
                <Button
                  onClick={handleProcessVideo}
                  disabled={isProcessing}
                  className="cursor-pointer"
                >
                  <KbdGroup className="mr-2">
                    <Kbd className="bg-black/10 backdrop-blur-md text-white border-white/20 rounded-md px-2 py-1 dark:bg-white/10 dark:border-black/20 dark:text-black">
                      ⌘ + e
                    </Kbd>
                  </KbdGroup>
                  {isProcessing ? "Processing..." : "Process"}
                  {isProcessing ? (
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="ml-2 h-4 w-4 animate-spin"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={Playlist01Icon}
                      className="ml-2 h-4 w-4"
                    />
                  )}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <VideoSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
};

export default VideoPreview;
