import { FolderResponse } from "../api/explorerApi";
import { authClient } from "../auth-client";
export type User = typeof authClient.$Infer.Session.user;
/* ------------- explorer types --------------- */

export type RootDirectory = {
  _id: string;
  name: string;
};
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
  loadFolder: (roomId: string, parentId?: string) => Promise<FolderResponse>;

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
export type Output = {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
  loading?: boolean;
  loaded?: boolean;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AIChat = {
  data: Message[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

export type CodeState = {
  content: string;
  savedContent: string;
  loaded?: boolean;
  loading?: boolean;
  saving?: boolean;
  generating?: boolean;
  running?: boolean;
  error?: string;
  isDeleted?: boolean;
};

export interface Store {
  /* ---------- State ---------- */

  code: Record<string, CodeState>;

  openFiles: FileItem[];

  activeFileId: string | null;

  outputs: Output[];

  response: Message[];

  user: User | null;
  setError(fileId: string, error?: string): void;
  /* ---------- User ---------- */

  setUser(user: User | null): void;

  /* ---------- File ---------- */

  openFile(file: FileItem, roomId: string): Promise<void>;

  closeFile(fileId: string): void;

  setActiveFile(fileId: string): void;

  setFileEdited(fileId: string, edited: boolean): void;

  updateContent(fileId: string, content: string): void;

  setSavedFileError(fileId: string, err: any): void;

  /* ---------- Cache ---------- */

  setLoadedFile(
    fileId: string,
    data: {
      content: string;
    },
  ): void;

  setSavedFile(fileId: string, content: string): void;

  setLoadFileError(fileId: string, err: any): void;

  setGeneratedContent(
    responseId: string,
    prompt: any,
    data: GenerateCodeResponse,
  ): void;
  setGeneratedError(err: string): void;

  setClearResponse(): void;
  /* ---------- Status ---------- */

  setLoading(fileId: string, loading: boolean): void;

  setSaving(fileId: string, saving: boolean): void;

  setRunning(fileId: string, running: boolean): void;

  setGenerating(fileId: string, generating: boolean): void;

  setClearResponse(): void;

  /* ---------- Output ---------- */

  addOutput(output: Output): void;

  removeOutput(id: string): void;

  clearOutputs(): void;

  setExecutionResult(fileId: string, result: RunCodeResponse): void;

  /* ---------- Terminal ---------- */

  runCommand(command: string, fileId: string): Promise<void>;
}

export type GenerateCodeResponse = {
  code: string;
};

export type RunCodeResponse = Output;

export interface CodeActions {
  loadFile(roomId: string, fileId: string): Promise<void>;

  saveFile(roomId: string, fileId: string, content: CodeState): Promise<void>;

  runCode(fileId: string, fileName: string): Promise<void>;

  generateCode(responseId: string, prompt: string): Promise<void>;

  formatCode?(fileId: string): Promise<void>;

  downloadFile?(fileId: string): Promise<void>;

  duplicateFile?(roomId: string, fileId: string): Promise<void>;
}
