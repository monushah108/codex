import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";

import { ChevronRight, File, Folder } from "lucide-react";
import { useState, useCallback, memo } from "react";

function FolderItem({
  item,
  roomId,
  creating,
  setCreating,
  setSelected,
  refresh,
}) {
  const [inputValue, setInputValue] = useState("");
  const [children, setChildren] = useState(item);
  const [loaded, setLoaded] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadChildren = useCallback(async () => {
    if (loaded) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/directory/${roomId}?parentId=${item._id}`);
      const data = await res.json();

      setChildren(data);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [roomId, item._id, loaded]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const res = await fetch(`/api/directory/${roomId}`, {
      method: "POST",
      body: JSON.stringify({
        name: inputValue,
        parentId: creating.parentId,
        type: creating.type,
      }),
    });

    const newItem = await res.json();

    // optimistic update
    if (creating.type === "file") {
      setChildren((prev) => ({
        ...prev,
        files: [...(prev.files || []), newItem],
      }));
    } else {
      setChildren((prev) => ({
        ...prev,
        folders: [...(prev.folders || []), newItem],
      }));
    }

    setInputValue("");
    setCreating({ parentId: null, type: null });
  };

  return (
    <div className="ml-4 text-sm">
      {/* FILES */}
      {children.files?.map((file) => (
        <div key={file._id} className="flex items-center gap-2 py-1">
          <File className="w-4 h-4 text-blue-400" />
          {file.name}
        </div>
      ))}

      {/* FOLDERS */}
      {children.folders?.map((folder) => (
        <Collapsible key={folder._id} onOpenChange={loadChildren}>
          <CollapsibleTrigger
            onClick={() => setSelected(folder._id)}
            className="flex items-center gap-1 py-1 hover:bg-[#2a2d2e] rounded px-1"
          >
            <ChevronRight className="w-4 h-4" />
            <Folder className="w-4 h-4 text-yellow-400" />
            {folder.name}
          </CollapsibleTrigger>

          <CollapsibleContent>
            {loading && (
              <div className="text-xs text-gray-500 px-2 py-1">
                <Spinner />
              </div>
            )}

            <FolderItem
              item={folder}
              roomId={roomId}
              creating={creating}
              setCreating={setCreating}
              setSelected={setSelected}
              refresh={refresh}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* CREATE INPUT */}
      {creating.parentId === item._id && (
        <div className="flex items-center gap-2 py-1">
          {creating.type === "file" ? (
            <File className="w-4 h-4 text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-400" />
          )}

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
    </div>
  );
}

export default memo(FolderItem);
