import { useClips } from "@/lib/clip/context";
import { useEffect, useRef, useState } from "react";
import { VideoQueueFilterDate, VideoQueueFilterDateRef } from "./filter/video-queue-filter-date";
import { VideoQueueFilterReset } from "./filter/video-queue-filter-reset";
import { VideoQueueFilterSearch, VideoQueueFilterSearchRef } from "./filter/video-queue-filter-search";
import { VideoQueueFilterStatus, VideoQueueFilterStatusRef } from "./filter/video-queue-filter-status";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueueListEmpty } from "./video-queue-list-empty";
import { VideoQueuePagination } from "./video-queue-pagination";

export const VideoQueueList = () => {
  const { clips, handleFetchClips } = useClips();
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const searchFilterRef = useRef<VideoQueueFilterSearchRef>(null);
  const statusFilterRef = useRef<VideoQueueFilterStatusRef>(null);
  const dateFilterRef = useRef<VideoQueueFilterDateRef>(null);

  const handleStatusChange = (status: string[]) => {
    setStatus(status);
    handleFetchClips({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handleSearchChange = (search: string) => {
    setSearch(search);
    handleFetchClips({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    handleFetchClips({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    setFrom(from);
    setTo(to);
    handleFetchClips({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handleReset = () => {
    setFrom(undefined);
    setTo(undefined);
    setSearch("");
    setStatus([]);
    searchFilterRef.current?.reset();
    statusFilterRef.current?.reset();
    dateFilterRef.current?.reset();
    handleFetchClips({
      page: page,
    });
  };

  useEffect(() => {
    handleFetchClips({ page: page });
  }, [handleFetchClips, page]);

  return (
    <>
      <>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <VideoQueueFilterSearch ref={searchFilterRef} onSearchChange={handleSearchChange} value={search} />
            <VideoQueueFilterStatus ref={statusFilterRef} onStatusChange={handleStatusChange} />
            {status.length > 0 || search.length > 0 || from || to ? <VideoQueueFilterReset onReset={handleReset} /> : null}
          </div>
          <VideoQueueFilterDate ref={dateFilterRef} onDateChange={handleDateChange} />
        </div>
      </>

      {clips.member.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {clips.member.map((clip) => (
              <VideoQueueCard key={clip.id} clip={clip} />
            ))}
          </div>
          <VideoQueuePagination onPageChange={handlePageChange} />
        </>
      )}

      {clips.member.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <VideoQueueListEmpty />
        </div>
      )}
    </>
  );
};

VideoQueueList.displayName = "VideoQueueList";
