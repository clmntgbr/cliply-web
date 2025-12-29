import { Input } from "@/components/ui/input";
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from "react";

interface VideoQueueFilterSearchProps {
  onSearchChange: (search: string) => void;
  value?: string;
}

export interface VideoQueueFilterSearchRef {
  reset: () => void;
}

const VideoQueueFilterSearchComponent = forwardRef<VideoQueueFilterSearchRef, VideoQueueFilterSearchProps>(function VideoQueueFilterSearch(
  { onSearchChange, value },
  ref
) {
  const [search, setSearch] = useState<string>(value ?? "");
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    setSearch(value ?? "");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [value]);

  const handleClearSearch = () => {
    setSearch("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSearchChange("");
  };

  const resetWithoutCallback = () => {
    setSearch("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useImperativeHandle(ref, () => ({
    reset: resetWithoutCallback,
  }));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Input placeholder="Search by name" value={search} onChange={handleInputChange} className="h-8 w-[150px] lg:w-[250px] pr-8" />
      {search && (
        <button
          onClick={handleClearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
});

export const VideoQueueFilterSearch = memo(VideoQueueFilterSearchComponent);
