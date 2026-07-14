import { FileItem, FolderItem } from "../store/types";

export type ExplorerOperation =
  | {
      operation: "create";
      target: "file" | "folder";
      payload: FileItem | FolderItem;
      parentId: string;
    }
  | {
      operation: "rename";
      target: "file" | "folder";
      id: string;
      name: string;
    }
  | {
      operation: "delete";
      target: "file" | "folder";
      id: string;
    }
  | {
      operation: "move";
      target: "file" | "folder";
      id: string;
      from: string;
      to: string;
    };

export type Activity = {
  id: string;
  roomId: string;

  user: {
    id: string;
    name: string;
    image?: string;
  };

  type: "create" | "rename" | "delete" | "move" | "save" | "join" | "leave";

  target: "file" | "folder" | "room";

  targetName: string;

  createdAt: number;
};
