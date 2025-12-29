import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface VideoSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoSettings = ({ open, onOpenChange }: VideoSettingsProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[500px] overflow-hidden px-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle>Video Settings</SheetTitle>
          <SheetDescription>Configure the video settings</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-2 px-4 overflow-y-auto flex-1">
          <div className="w-full space-y-4"></div>
        </div>

        <SheetFooter className="flex justify-center gap-3 px-4 py-4 border-t">
          <Button variant="default" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default VideoSettings;
