import { Awareness } from "y-protocols/awareness";
import { getYDoc } from "./yjs";

const awarenessMap = new Map<string, Awareness>();

export function getAwareness(roomId: string, fileId: string): Awareness {
  const key = `${roomId}:${fileId}`;

  if (!awarenessMap.has(key)) {
    awarenessMap.set(key, new Awareness(getYDoc(roomId, fileId)));
  }

  return awarenessMap.get(key)!;
}

export function destroyAwareness(roomId: string, fileId: string) {
  const key = `${roomId}:${fileId}`;
  const awareness = awarenessMap.get(key);

  if (!awareness) return;

  awareness.destroy();
  awarenessMap.delete(key);
}
