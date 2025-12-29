import { Button } from "@/components/ui/button";
import { useClips } from "@/lib/clip/context";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface VideoQueuePaginationProps {
  onPageChange: (page: number) => void;
}

export function VideoQueuePagination({ onPageChange }: VideoQueuePaginationProps) {
  const { clips } = useClips();

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex + 1);
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-muted-foreground flex-1 text-sm"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {clips.currentPage} of {clips.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(0)}
            disabled={clips.currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <HugeiconsIcon icon={ChevronsLeft} size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(clips.currentPage - 2)}
            disabled={clips.currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <HugeiconsIcon icon={ChevronLeft} size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(clips.currentPage)}
            disabled={clips.currentPage >= clips.totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <HugeiconsIcon icon={ChevronRight} size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(clips.totalPages - 1)}
            disabled={clips.currentPage >= clips.totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <HugeiconsIcon icon={ChevronsRight} size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
