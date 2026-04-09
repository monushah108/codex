"use client";

import { useState } from "react";

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
import { useCodestore } from "@/lib/store/Codestore";

type Props = {
  onSave: () => void;
  onDiscard: () => void;
};

export default function SaveFile({ onSave, onDiscard }: Props) {
  const [open, setOpen] = useState(false);
  const setEdited = useCodestore((s) => s.setFileEdited);
  const activeFileId = useCodestore((s) => s.activeFileId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <span className="size-2 bg-white rounded-full cursor-pointer"></span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            This file has unsaved changes. Do you want to save before leaving?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              onDiscard();
              setOpen(false);
              setEdited(activeFileId, false);
            }}
          >
            Discard
          </Button>

          <Button
            onClick={() => {
              onSave();
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
