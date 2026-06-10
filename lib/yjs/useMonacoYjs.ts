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

      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      awareness = new Awareness(ydoc);

      awareness.setLocalStateField("user", {
        name: user.name,
        color: user.color,
      });

      const model = editor.getModel();

      if (!model) return;

      const yText = ydoc.getText("document");

      binding = new MonacoBinding(yText, model, new Set([editor]), awareness);

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
