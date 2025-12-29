import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useClips } from "@/lib/clip/context";
import { Clip } from "@/lib/clip/types";
import { date } from "@/lib/date";
import { Download01Icon, More01Icon, Settings01Icon, Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import VideoSettings from "../upload/video-settings";
import Status from "./video-queue-status";

type VideoQueueCardProps = {
  clip: Clip;
};

export function VideoQueueCard({ clip }: VideoQueueCardProps) {
  const { handleDownloadClip, handleDeleteClip } = useClips();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDownload = () => {
    if (!clip.isDownloadable || !clip.id) {
      toast.error("Clip not available");
      return;
    }
    handleDownloadClip(clip.id, clip.originalVideo.originalName);
  };

  const handleDelete = async () => {
    if (!clip.id) {
      toast.error("Clip not available");
      return;
    }
    await handleDeleteClip(clip.id);
  };

  const handleViewOptions = () => {
    setSettingsOpen(true);
  };

  return (
    <>
      <Card key={clip.id} className="flex flex-col gap-0 pt-0 overflow-hidden relative py-0 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-gray-500/50 size-8 cursor-pointer absolute top-0 right-0 rounded-full bg-gray-500/50 hover:bg-gray-500/70"
            >
              <HugeiconsIcon icon={More01Icon} className="text-white" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={handleDownload} disabled={!clip.isDownloadable} className="cursor-pointer">
              <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewOptions} className="cursor-pointer">
              <HugeiconsIcon icon={Settings01Icon} className="mr-2 size-4" />
              View Options
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/clip/${clip.id}`)} className="cursor-pointer">
              <HugeiconsIcon icon={Settings01Icon} className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive">
              <HugeiconsIcon icon={Trash} className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {clip.thumbnail ? (
          <Image
            loading="lazy"
            src={clip.thumbnail}
            alt={clip.originalVideo.originalName}
            width={300}
            height={150}
            className="w-full h-[150px] object-cover object-center rounded-t-lg mb-4"
          />
        ) : (
          <div className="w-full h-[150px] bg-muted rounded-t-lg mb-4 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No thumbnail</span>
          </div>
        )}
        <CardHeader className="mb-4 gap-0">
          <CardDescription className="text-xs text-muted-foreground">{date(clip.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 overflow-hidden">
          <HoverCard>
            <HoverCardTrigger asChild>
              <CardTitle className="font-medium hover:underline cursor-pointer text-sm mb-10 line-">
                {clip.originalVideo.originalName.replace(".mp4", "")}
              </CardTitle>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-base font-semibold">{clip.originalVideo.originalName.replace(".mp4", "")}</h4>
                <div className="flex gap-2">
                  {clip.originalVideo.format && <Badge variant="outline">{clip.originalVideo.format}</Badge>}
                  {clip.originalVideo.size && <Badge variant="outline">{clip.originalVideo.size.toFixed(2)} MB</Badge>}
                  {clip.originalVideo.duration && <Badge variant="outline">{clip.originalVideo.duration}</Badge>}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="w-full flex justify-center absolute bottom-0 left-0">
                <Status clip={clip} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold">{clip.status}</h4>
                  <p className="text-base">{clip.status}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>

      <VideoSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
