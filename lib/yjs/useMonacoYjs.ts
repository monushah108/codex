"use client";

import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { setupYjsSocketSync } from "./yjsSocketSync";

export function useMonacoYjs({ editor, socket, roomId, fileId, user }) {
  const ydocRef = useRef(null);

  useEffect(() => {
    if (!editor || !fileId) return;

    let binding;
    let awareness;

    async function init() {
      const { MonacoBinding } = await import("y-monaco");

      // DOC
      const ydoc = new Y.Doc();

      ydocRef.current = ydoc;

      // AWARENESS
      awareness = new Awareness(ydoc);

      awareness.setLocalStateField("user", {
        name: user.name,
        color: user.color,
      });

      const yText = ydoc.getText(fileId);

      if (yText.length === 0 && editor.getValue()) {
        yText.insert(0, editor.getValue());
      }

      const model = editor.getModel();

      binding = new MonacoBinding(yText, model, new Set([editor]), awareness);

      // SOCKET SYNC
      const cleanup = setupYjsSocketSync({
        socket,
        ydoc,
        awareness,
        roomId,
        fileId,
      });

      binding.cleanup = cleanup;
    }

    init();

    return () => {
      binding?.destroy();

      binding?.cleanup?.();

      awareness?.destroy();

      ydocRef.current?.destroy();
    };
  }, [editor, roomId, fileId, socket, user]);
}
