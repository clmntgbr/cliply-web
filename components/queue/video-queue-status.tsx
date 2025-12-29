"use client";

import { Clip } from "@/lib/clip/types";
import { CheckmarkCircle01Icon, Loading01FreeIcons, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "../ui/badge";

interface StatusProps {
  clip: Clip;
}

export default function Status({ clip }: StatusProps) {
  return (
    <>
      <Badge
        variant="outline"
        className="text-muted-foreground px-1.5 cursor-pointer w-full border-b-0 border-l-0 border-r-0 py-2 rounded-none text-sm"
      >
        {clip.isCompleted && (
          <>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-emerald-400" />
            {clip.status}
          </>
        )}
        {clip.isFailed && (
          <>
            <HugeiconsIcon icon={X} className="size-4 text-red-500" /> {clip.status}
          </>
        )}
        {clip.isProcessing && (
          <>
            <HugeiconsIcon icon={Loading01FreeIcons} className="size-4 animate-spin text-blue-400" />
            {clip.status}
          </>
        )}
      </Badge>
    </>
  );
}
