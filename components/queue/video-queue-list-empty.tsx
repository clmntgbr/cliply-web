import { EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Folder01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function VideoQueueListEmpty() {
  return (
    <>
      <EmptyContent>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Folder01FreeIcons} />
          </EmptyMedia>
          <EmptyTitle>No streams in the queue</EmptyTitle>
          <EmptyDescription>Add a video to the queue to get started</EmptyDescription>
        </EmptyHeader>
      </EmptyContent>
    </>
  );
}
