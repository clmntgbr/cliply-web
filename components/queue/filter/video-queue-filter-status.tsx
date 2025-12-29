import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckmarkCircle01Icon, PlusSignCircleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { VideoQueueStatuses } from "../video-queue-statuses";

interface VideoQueueFilterStatusProps {
  onStatusChange: (status: string[]) => void;
  value?: string[];
}

export interface VideoQueueFilterStatusRef {
  reset: () => void;
}

const VideoQueueFilterStatusComponent = forwardRef<VideoQueueFilterStatusRef, VideoQueueFilterStatusProps>(function VideoQueueFilterStatus(
  { onStatusChange, value },
  ref
) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[] | undefined>(value ?? undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSelectStatus = (status: string) => {
    if (selectedStatuses && selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      return;
    }
    setSelectedStatuses([...(selectedStatuses || []), status]);
  };

  const resetWithoutCallback = () => {
    setSelectedStatuses(undefined);
  };

  useImperativeHandle(ref, () => ({
    reset: resetWithoutCallback,
  }));

  useEffect(() => {
    if (selectedStatuses) {
      onStatusChange(selectedStatuses);
    }
  }, [selectedStatuses]);

  return (
    <>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed cursor-pointer hover:bg-accent hover:text-accent-foreground dark:bg-input">
            <HugeiconsIcon icon={PlusSignCircleFreeIcons} />
            Filter by status
            {selectedStatuses && selectedStatuses.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                  {selectedStatuses && selectedStatuses.length}
                </Badge>
                <div className="hidden gap-1 lg:flex">
                  {selectedStatuses.length > 2 ? (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      Filter by status {selectedStatuses.length}
                    </Badge>
                  ) : (
                    VideoQueueStatuses.filter((status: { value: string }) => selectedStatuses.includes(status.value)).map(
                      (status: { value: string }) => (
                        <Badge variant="secondary" key={status.value} className="rounded-sm px-1 font-normal">
                          {status.value}
                        </Badge>
                      )
                    )
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent id="status-filter-content" className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {VideoQueueStatuses.map((status) => {
                  const isSelected = selectedStatuses && selectedStatuses.includes(status.value);
                  return (
                    <CommandItem key={status.value} onSelect={() => handleSelectStatus(status.value)}>
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-[4px] border",
                          isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input [&_svg]:invisible"
                        )}
                      >
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="text-primary-foreground size-3.5" />
                      </div>
                      <span>{status.value}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedStatuses && selectedStatuses.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={() => setSelectedStatuses([])} className="justify-center text-center">
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
});

export const VideoQueueFilterStatus = memo(VideoQueueFilterStatusComponent);
