import { FolderResponse } from "../api/explorerApi";
import { authClient } from "../auth-client";
export type User = typeof authClient.$Infer.Session.user;
/* ------------- explorer types --------------- */

export type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  renamed?: boolean;
};

export type FolderItem = {
  _id: string;
  name: string;
  isDeleted?: boolean;
  renamed?: boolean;
};

export type FolderChildren = {
  folders: FolderItem[];
  files: FileItem[];
  selectedFileId?: string;
  loaded: boolean;
  loading: boolean;
};

export type Activity = {
  id: string;
  userId: string;
  userName: string;
  type: "add" | "update" | "remove";
  target: "file" | "folder";
  fileName: string;
  time: string;
  message: string;
};
export type ExplorerStore = {
  cache: Record<string, FolderChildren>;
  members: User[];
  activity: Activity[];

  setMembers: (members: User[]) => void;

  setActivity: (activity: Activity) => void;

  removeActivity: (id: string) => void;

  loadFolder: (
    roomId: string,
    parentId: string,
    data: FolderChildren,
    force?: boolean,
  ) => Promise<FolderResponse>;
  setSelectedFile: (parentId: string, fileId: string) => void;

  insertFile: (parentId: string, file: FileItem) => void;
  insertFolder: (parentId: string, folder: FolderItem) => void;

  updateFile: (parentId: string, fileId: string, newName: string) => void;
  updateFolder: (parentId: string, folderId: string, newName: string) => void;

  removeFile: (parentId: string, fileId: string) => void;
  removeFolder: (parentId: string, folderId: string) => void;
};

// Actions types
export type ExplorerActions = {
  loadFolder: (
    roomId: string,
    parentId: string,
    force?: boolean,
  ) => Promise<void>;

  addFile: (
    roomId: string,
    parentId: string,
    name: string,
  ) => Promise<FileItem>;

  addFolder: (
    roomId: string,
    parentId: string,
    name: string,
  ) => Promise<FolderItem>;

  renameFile: (
    roomId: string,
    parentId: string,
    fileId: string,
    newName: string,
  ) => Promise<void>;

  renameFolder: (
    roomId: string,
    parentId: string,
    folderId: string,
    newName: string,
  ) => Promise<void>;

  deleteFile: (
    roomId: string,
    parentId: string,
    fileId: string,
  ) => Promise<void>;

  deleteFolder: (
    roomId: string,
    parentId: string,
    folderId: string,
  ) => Promise<void>;
};

/* ------------- codes types --------------- */

type Output = {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
};

export type CodeState = {
  content: string;
  savedContent: string;
  loaded?: boolean;
  loading?: boolean;
  saving?: boolean;
  generating?: boolean;
  running?: boolean;
  isDeleted?: boolean;
};
export type Store = {
  code: Record<string, CodeState>;

  openFiles: FileItem[];

  activeFileId: string | null;

  outputs: Output[];

  user: User | null;
  setUser: (user: User | null) => void;

  openFile: (file: FileItem, roomId: string) => Promise<void>;

  closeFile: (fileId: string) => void;

  setActiveFile: (fileId: string) => void;

  setFileEdited: (fileId: string, edited: boolean) => void;

  updateContent: (fileId: string, content: string) => void;

  loadFileContent: (roomId: string, fileId: string) => Promise<void>;
  runCode: (fileId: string, content?: string) => Promise<void>;
  runCommand: (command: string, fileId: string) => Promise<void>;
  clearOutputs: () => void;
  saveFileContent: (
    roomId: string,
    fileId: string,
    content: string,
  ) => Promise<void>;

  generateCode: (fileId: string, prompt: string) => Promise<void>;
};
