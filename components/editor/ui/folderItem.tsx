import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, ChevronRight, FileIcon, Folder } from "lucide-react";
import { useState, memo } from "react";

import { useExplorerstore } from "@/lib/store/Explorerstore";
import ExplorerMenu from "../Module/ExplorerMenu";
import { useCodestore } from "@/lib/store/Codestore";

type Folderprop = {
  item: {
    _id: string;
    name: string;
  };
  roomId: string;
  creating: { parentId: string | null; type: "file" | "folder" | null };
  setCreating: (value: {
    parentId: string | null;
    type: "file" | "folder" | null;
  }) => void;
  setSelected: (id: string) => void;
  selected: string | null;
  depth?: number;
};

function FolderItem({
  item,
  roomId,
  creating,
  setCreating,
  setSelected,
  selected,

  depth = 0,
}: Folderprop) {
  const [inputValue, setInputValue] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const cache = useExplorerstore((s) => s.cache[item._id]);
  const loadFolder = useExplorerstore((s) => s.loadFolder);
  const addFile = useExplorerstore((s) => s.addFile);
  const addFolder = useExplorerstore((s) => s.addFolder);
  const renameFile = useExplorerstore((s) => s.renameFile);
  const renameFolder = useExplorerstore((s) => s.renameFolder);
  const deleteFile = useExplorerstore((s) => s.deleteFile);
  const deleteFolder = useExplorerstore((s) => s.deleteFolder);
  const openFile = useCodestore((s) => s.openFile);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"file" | "folder" | null>(null);

  const folders = cache?.folders || [];
  const files = cache?.files || [];
  const loading = cache?.loading;

  const indent = depth * 12;

  const isSelected = selected === item._id;

  /* ---------------- VALIDATE NAMES ----------------- */

  const validateName = ({
    value,
    type,
    currentId,
  }: {
    value: string;
    type: "file" | "folder";
    currentId?: string;
  }) => {
    const name = value.trim().toLowerCase();

    const fileExists = files.some(
      (file) =>
        file._id !== currentId && file.name.trim().toLowerCase() === name,
    );

    const folderExists = folders.some(
      (folder) =>
        folder._id !== currentId && folder.name.trim().toLowerCase() === name,
    );

    if (type === "file" && fileExists) {
      setError("File already exists");
      setErrorType("file");
      return false;
    }

    if (type === "folder" && folderExists) {
      setError("Folder already exists");
      setErrorType("folder");
      return false;
    }

    setError(null);
    setErrorType(null);

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    validateName({
      value,
      type: creating.type!,
    });
  };

  /* ---------------- CREATE ---------------- */

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    if (error) return;

    if (creating.type === "file") addFile(roomId, item._id, inputValue);
    else addFolder(roomId, item._id, inputValue);

    setInputValue("");
    setCreating({ parentId: null, type: null });
  };

  /* ---------------- RENAME ---------------- */
  const clearError = () => {
    setError(null);
    setErrorType(null);
  };
  const handleRename = (id: string, name: string) => {
    clearError();
    setRenamingId(id);
    setRenameValue(name);
  };

  const submitRename = async (type: "file" | "folder"): Promise<void> => {
    if (!renameValue.trim()) return;
    if (error) return;

    if (type === "file") renameFile(roomId, item._id, renamingId, renameValue);
    if (type === "folder")
      renameFolder(roomId, item._id, renamingId, renameValue);

    setRenamingId(null);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = (id: string, type: "file" | "folder") => {
    if (type === "file") deleteFile(roomId, item._id, id);
    if (type === "folder") deleteFolder(roomId, item._id, id);
  };

  return (
    <Collapsible
      onOpenChange={(open) => {
        if (open) loadFolder(roomId, item._id);
        setIsOpen(open);
      }}
    >
      {/* FOLDER ROW */}

      <ExplorerMenu
        key={item._id}
        id={item._id}
        name={item.name}
        onRename={handleRename}
        onDelete={(id: string) => handleDelete(id, "folder")}
      >
        <CollapsibleTrigger
          onClick={() => setSelected(item._id)}
          style={{ paddingLeft: indent }}
          className={` w-full flex items-center gap-1 py-1 rounded 
          ${isSelected ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />

          <Folder className="w-4 h-4 text-yellow-400" />
          {renamingId === item._id ? (
            <div className="flex flex-col gap-1">
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setRenameValue(value);
                  validateName({
                    value,
                    type: "folder",
                    currentId: item._id,
                  });
                }}
                onFocus={(e) => e.target.select()}
                onBlur={() => {
                  clearError();
                  setRenamingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename("folder");
                  if (e.key === "Escape") {
                    clearError();
                    setRenamingId(null);
                  }
                }}
                className="bg-transparent border border-sky-500 px-1 text-sm outline-none"
              />
              {error && errorType === "folder" && renamingId == item._id && (
                <span className="text-destructive text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </span>
              )}
            </div>
          ) : (
            item.name
          )}
        </CollapsibleTrigger>
      </ExplorerMenu>

      {/* CONTENT */}

      <CollapsibleContent>
        {loading && (
          <div className="px-2 py-1">
            <Spinner />
          </div>
        )}

        {/* FILES */}

        {files.map((file) => {
          const isSelectedFile = selected === file._id;

          return (
            <ExplorerMenu
              key={file._id}
              name={file.name}
              id={file._id}
              onRename={(id: string, name: string) => {
                setRenamingId(id);
                setRenameValue(name);
              }}
              onDelete={(id: string) => handleDelete(id, "file")}
            >
              <div
                onClick={() => {
                  setSelected(file._id);
                  openFile(file, roomId);
                }}
                style={{ paddingLeft: indent + 20 }}
                className={`flex items-center gap-2 py-1 rounded
                ${isSelectedFile ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}
              >
                <FileIcon className="w-4 h-4 text-gray-400" />

                {renamingId === file._id ? (
                  <div className="flex flex-col gap-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => {
                        const value = e.target.value;

                        setRenameValue(value);

                        validateName({
                          value,
                          type: "file",
                          currentId: file._id,
                        });
                      }}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setRenamingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitRename("file");
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      className="bg-transparent  border border-sky-500 px-1 text-sm outline-none"
                    />
                    {error &&
                      errorType === "file" &&
                      renamingId == file._id && (
                        <span className="text-destructive text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {error}
                        </span>
                      )}
                  </div>
                ) : (
                  file.name
                )}
              </div>
            </ExplorerMenu>
          );
        })}

        {/* CHILD FOLDERS */}

        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            item={folder}
            roomId={roomId}
            creating={creating}
            setCreating={setCreating}
            setSelected={setSelected}
            selected={selected}
            depth={depth + 1}
          />
        ))}

        {/* CREATE INPUT */}

        {creating?.parentId === item._id && (
          <div
            style={{ paddingLeft: indent + 20 }}
            className="flex items-center gap-2 py-1"
          >
            <input
              autoFocus
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();

                if (e.key === "Escape") {
                  setCreating({ parentId: null, type: null });
                }
              }}
              onBlur={() => {
                clearError();
                setCreating({ parentId: null, type: null });
              }}
              className="bg-transparent border border-[#3a3d3e] px-1 text-sm outline-none"
            />
            {error && (
              <div className="text-destructive text-xs ml-2 flex items-center ">
                <AlertCircle className="w-3 h-3" /> {error}
              </div>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(FolderItem);
