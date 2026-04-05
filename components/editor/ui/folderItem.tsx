import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Spinner } from "@/components/ui/spinner";
import { ChevronRight, FileIcon, Folder } from "lucide-react";
import { useState, memo } from "react";

import { useExplorerstore } from "@/lib/store/Explorerstore";
import ExplorerMenu from "../Module/ExplorerMenu";
import { useCodestore } from "@/lib/store/Codestore";

function FolderItem({
  item,
  roomId,
  creating,
  setCreating,
  setSelected,
  selected,
  depth = 0,
}) {
  const [inputValue, setInputValue] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const cache = useExplorerstore((s) => s.cache[item._id]);
  const loadFolder = useExplorerstore((s) => s.loadFolder);
  const addFile = useExplorerstore((s) => s.addFile);
  const addFolder = useExplorerstore((s) => s.addFolder);
  const renameFile = useExplorerstore((s) => s.renameFile);
  const renameFolder = useExplorerstore((s) => s.renameFolder);
  const deleteFile = useExplorerstore((s) => s.deleteFile);
  const deleteFolder = useExplorerstore((s) => s.deleteFolder);
  const openFile = useCodestore((s) => s.openFile);

  const folders = cache?.folders || [];
  const files = cache?.files || [];
  const loading = cache?.loading;

  const indent = depth * 12;

  const isSelected = selected === item._id;

  /* ---------------- CREATE ---------------- */

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const endpoint =
      creating.type === "file"
        ? `/api/playground/${roomId}/files`
        : `/api/playground/${roomId}/directory`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: inputValue,
        parentId: item._id,
      }),
    });

    const newItem = await res.json();

    if (creating.type === "file") addFile(item._id, newItem);
    else addFolder(item._id, newItem);

    setInputValue("");
    setCreating({ parentId: null, type: null });
  };

  /* ---------------- RENAME ---------------- */

  const handleRename = (id, name) => {
    setRenamingId(id);
    setRenameValue(name);
  };

  const submitRename = async (type) => {
    if (!renameValue.trim()) return;

    const endpoint =
      type === "file"
        ? `/api/playground/${roomId}/files`
        : `/api/playground/${roomId}/directory`;

    await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: renamingId,
        name: renameValue,
      }),
    });

    if (type === "file") renameFile(item._id, renamingId, renameValue);
    if (type === "folder") renameFolder(item._id, renamingId, renameValue);

    setRenamingId(null);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id, type) => {
    const endpoint =
      type === "file"
        ? `/api/playground/${roomId}/files`
        : `/api/playground/${roomId}/directory`;

    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (type === "file") deleteFile(item._id, id);
    if (type === "folder") deleteFolder(item._id, id);
  };

  return (
    <Collapsible
      onOpenChange={(open) => {
        if (open) loadFolder(roomId, item._id);
      }}
    >
      {/* FOLDER ROW */}

      <ExplorerMenu
        key={item._id}
        id={item._id}
        name={item.name}
        onRename={handleRename}
        onDelete={(id) => handleDelete(id, "folder")}
      >
        <CollapsibleTrigger
          onClick={() => setSelected(item._id)}
          style={{ paddingLeft: indent }}
          className={` w-full flex items-center gap-1 py-1 rounded
          ${isSelected ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90" : ""}`}
          />

          <Folder className="w-4 h-4 text-yellow-400" />

          {renamingId === item._id ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={() => setRenamingId(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename("folder");
                if (e.key === "Escape") setRenamingId(null);
              }}
              className="bg-transparent border border-sky-500 px-1 text-sm outline-none"
            />
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
              onRename={(id, name) => {
                setRenamingId(id);
                setRenameValue(name);
              }}
              onDelete={(id) => handleDelete(id, "file")}
            >
              <div
                onClick={() => {
                  setSelected(file._id);
                  openFile(file);
                }}
                style={{ paddingLeft: indent + 20 }}
                className={`flex items-center gap-2 py-1 rounded
                ${isSelectedFile ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}
              >
                <FileIcon className="w-4 h-4 text-gray-400" />

                {renamingId === file._id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => setRenamingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitRename("file");
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    className="bg-transparent  border border-sky-500 px-1 text-sm outline-none"
                  />
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

        {creating.parentId === item._id && (
          <div
            style={{ paddingLeft: indent + 20 }}
            className="flex items-center gap-2 py-1"
          >
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();

                if (e.key === "Escape") {
                  setCreating({ parentId: null, type: null });
                }
              }}
              className="bg-transparent border border-[#3a3d3e] px-1 text-sm outline-none"
            />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(FolderItem);
