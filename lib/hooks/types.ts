import { FileItem, FolderItem, User } from "../store/types";

export type ExplorerOperation =
  | {
      type: "add";
      target: "file";
      payload: {
        parentId: string;
        file: FileItem;
      };
    }
  | {
      type: "add";
      target: "folder";
      payload: {
        parentId: string;
        folder: FolderItem;
      };
    }
  | {
      type: "update";
      target: "file";
      payload: {
        parentId: string;
        id: string;
        newName: string;
      };
    }
  | {
      type: "update";
      target: "folder";
      payload: {
        parentId: string;
        id: string;
        newName: string;
      };
    }
  | {
      type: "remove";
      target: "file";
      payload: {
        parentId: string;
        id: string;
      };
    }
  | {
      type: "remove";
      target: "folder";
      payload: {
        parentId: string;
        id: string;
      };
    };

export type UseExplorerSocket = {
  applyCreate(
    roomId: string,
    user: User,
    parentId: string,
    item: FileItem,
    target: "file",
  ): void;

  applyCreate(
    roomId: string,
    user: User,
    parentId: string,
    item: FolderItem,
    target: "folder",
  ): void;

  applyUpdate(
    roomId: string,
    user: User,
    parentId: string,
    id: string,
    newName: string,
    target: "file" | "folder",
  ): void;

  applyRemove(
    roomId: string,
    user: User,
    parentId: string,
    id: string,
    target: "file" | "folder",
  ): void;
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
