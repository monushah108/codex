"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
};

export default function SaveFile({ open, onSave, onDiscard, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogTrigger>
        <span className="size-1.5 bg-white rounded-full"></span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            This file has unsaved changes. Do you want to save before leaving?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={onDiscard}>
            Discard
          </Button>

          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
