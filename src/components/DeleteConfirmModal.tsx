"use client";
import { useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CV } from "@/types/cv";
import { AlertTriangle } from "lucide-react";

export const DeleteConfirmModal = ({
  open,
  onOpenChange,
  cv,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cv: CV | null;
  onConfirm: () => void;
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentTime = useMemo(() => Date.now(), [open]);

  if (!cv) return null;

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDialogTitle>Delete CV?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <div className="bg-gray-50 p-3 rounded-md space-y-1">
              <div className="font-semibold text-gray-900">&quot;{cv.title}&quot;</div>
              <div className="text-sm text-gray-600">
                Last modified: {timeAgo(cv.lastModified)}
              </div>
              <div className="text-sm text-gray-600">
                Contains: {cv.experience.length} job
                {cv.experience.length !== 1 ? "s" : ""}, {cv.education.length}{" "}
                school{cv.education.length !== 1 ? "s" : ""}
              </div>
            </div>
            <p className="text-red-600 font-medium">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
