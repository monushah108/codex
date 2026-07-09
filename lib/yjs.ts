import * as Y from "yjs";

const docs = new Map<string, Y.Doc>();
export function getYDoc(roomId: string, fileId: string) {
  const key = `${roomId}:${fileId}`;

  if (!docs.has(key)) {
    docs.set(key, new Y.Doc());
  }

  return docs.get(key)!;
}

export function getYText(roomId: string, fileId: string) {
  return getYDoc(roomId, fileId).getText("editor");
}

export function destroyYDoc(roomId: string, fileId: string) {
  const key = `${roomId}:${fileId}`;
  const doc = docs.get(key);

  if (!doc) return;

  doc.destroy();
  docs.delete(key);
}
