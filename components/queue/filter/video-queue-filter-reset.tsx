import { Button } from "@/components/ui/button";
import { X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface VideoQueueFilterResetProps {
  onReset: () => void;
}

export function VideoQueueFilterReset({ onReset }: VideoQueueFilterResetProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onReset}>
      Reset Filters
      <HugeiconsIcon icon={X} />
    </Button>
  );
}
