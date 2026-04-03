import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Spinner } from "@/components/ui/spinner";
import { ChevronRight, FileIcon, Folder } from "lucide-react";
import { useState, memo } from "react";

import { useFilestore } from "@/lib/store/Filestore";

function FolderItem({
  item,
  roomId,
  creating,
  setCreating,
  selected,
  setSelected,
  depth = 0,
}) {
  const [inputValue, setInputValue] = useState("");

  const cache = useFilestore((s) => s.cache[item._id]);
  const loadFolder = useFilestore((s) => s.loadFolder);
  const addFile = useFilestore((s) => s.addFile);
  const addFolder = useFilestore((s) => s.addFolder);

  const folders = cache?.folders || [];
  const files = cache?.files || [];
  const loading = cache?.loading;

  const indent = depth * 12;

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const res = await fetch(`/api/directory/${roomId}`, {
      method: "POST",
      body: JSON.stringify({
        name: inputValue,
        parentId: item._id,
        type: creating.type,
      }),
    });

    const newItem = await res.json();

    if (creating.type === "file") addFile(item._id, newItem);
    else addFolder(item._id, newItem);

    setInputValue("");
    setCreating({ parentId: null, type: null });
  };

  const isSelected = selected === item._id;

  return (
    <Collapsible
      onOpenChange={(open) => {
        if (open) loadFolder(roomId, item._id);
      }}
    >
      {/* FOLDER ROW */}

      <CollapsibleTrigger
        onClick={() => setSelected(item._id)}
        style={{ paddingLeft: indent }}
        className={`group flex items-center gap-1 py-1 rounded w-full
  ${isSelected ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}
      >
        <ChevronRight
          className={`w-4 h-4 transition-transform group-data-[state=open]:rotate-90`}
        />

        <Folder className="w-4 h-4 text-yellow-400" />

        {item.name}
      </CollapsibleTrigger>

      <CollapsibleContent>
        {loading && (
          <div className="px-2 py-1">
            <Spinner />
          </div>
        )}

        {/* FILES */}

        {files.map((file) => {
          const isSelected = selected === file._id;

          return (
            <div
              key={file._id}
              onClick={() => setSelected(file._id)}
              style={{ paddingLeft: indent + 20 }}
              className={`flex items-center gap-2 py-1 rounded
      ${isSelected ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}
            >
              <FileIcon className="w-4 h-4 text-gray-400" />
              {file.name}
            </div>
          );
        })}
        {/* FOLDERS */}

        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            item={folder}
            roomId={roomId}
            creating={creating}
            setCreating={setCreating}
            selected={selected}
            setSelected={setSelected}
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
