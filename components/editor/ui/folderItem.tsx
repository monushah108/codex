// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Spinner } from "@/components/ui/spinner";

// import { ChevronRight, File, Folder } from "lucide-react";
// import { useState, useCallback, memo } from "react";

// function FolderItem({ item, roomId, creating, setCreating, setSelected }) {
//   const [inputValue, setInputValue] = useState("");

//   const [children, setChildren] = useState({
//     folders: [],
//     files: [],
//   });

//   const [loading, setLoading] = useState(false);

//   const [loadedFolders, setLoadedFolders] = useState({});

//   /* =========================
//      Load folder children
//   ========================= */

//   const loadChildren = useCallback(async () => {
//     if (loadedFolders[item._id]) return;

//     try {
//       setLoading(true);

//       const res = await fetch(`/api/directory/${roomId}?parentId=${item._id}`);
//       const data = await res.json();

//       setChildren({
//         folders: data.folders || [],
//         files: data.files || [],
//       });

//       setLoadedFolders((prev) => ({
//         ...prev,
//         [item._id]: true,
//       }));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [roomId, item._id, loadedFolders]);

//   /* =========================
//      Create File / Folder
//   ========================= */

//   const handleSubmit = async () => {
//     if (!inputValue.trim()) return;

//     const res = await fetch(`/api/directory/${roomId}`, {
//       method: "POST",
//       body: JSON.stringify({
//         name: inputValue,
//         parentId: item._id,
//         type: creating.type,
//       }),
//     });

//     const newItem = await res.json();

//     if (creating.type === "file") {
//       setChildren((prev) => ({
//         ...prev,
//         files: [...prev.files, newItem],
//       }));
//     } else {
//       setChildren((prev) => ({
//         ...prev,
//         folders: [...prev.folders, newItem],
//       }));
//     }

//     setInputValue("");
//     setCreating({ parentId: null, type: null });
//   };

//   return (
//     <div className="ml-4 text-sm">
//       {/* FOLDER HEADER */}

//       <Collapsible
//         onOpenChange={(open) => {
//           if (open) loadChildren();
//         }}
//       >
//         <CollapsibleTrigger
//           onClick={() => setSelected(item._id)}
//           className="flex items-center gap-1 py-1 hover:bg-[#2a2d2e] rounded px-1"
//         >
//           <ChevronRight className="w-4 h-4" />
//           <Folder className="w-4 h-4 text-yellow-400" />
//           {item.name}
//         </CollapsibleTrigger>

//         <CollapsibleContent>
//           {loading && (
//             <div className="px-2 py-1">
//               <Spinner />
//             </div>
//           )}

//           {/* FILES */}

//           {children.files.map((file) => (
//             <div key={file._id} className="flex items-center gap-2 py-1">
//               <File className="w-4 h-4 text-blue-400" />
//               {file.name}
//             </div>
//           ))}

//           {/* FOLDERS */}

//           {children.folders.map((folder) => (
//             <FolderItem
//               key={folder._id}
//               item={folder}
//               roomId={roomId}
//               creating={creating}
//               setCreating={setCreating}
//               setSelected={setSelected}
//             />
//           ))}

//           {/* CREATE INPUT */}

//           {creating.parentId === item._id && (
//             <div className="flex items-center gap-2 py-1">
//               {creating.type === "file" ? (
//                 <File className="w-4 h-4 text-blue-400" />
//               ) : (
//                 <Folder className="w-4 h-4 text-yellow-400" />
//               )}

//               <input
//                 autoFocus
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSubmit();

//                   if (e.key === "Escape") {
//                     setCreating({ parentId: null, type: null });
//                   }
//                 }}
//                 className="bg-transparent border border-[#3a3d3e] px-1 text-sm outline-none"
//               />
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>
//     </div>
//   );
// }

// export default memo(FolderItem);

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Spinner } from "@/components/ui/spinner";
// import { useFilestore } from "@/lib/store/Filestore";

// import { ChevronRight, File, Folder } from "lucide-react";
// import { useState, memo } from "react";

// function FolderItem({ item, roomId, creating, setCreating, setSelected }) {
//   const [inputValue, setInputValue] = useState("");

//   const cache = useFilestore((s) => s.cache[item._id]);
//   const loadFolder = useFilestore((s) => s.loadFolder);
//   const addFile = useFilestore((s) => s.addFile);
//   const addFolder = useFilestore((s) => s.addFolder);

//   const folders = cache?.folders || [];
//   const files = cache?.files || [];
//   const loading = cache?.loading;

//   /* =========================
//      Create File / Folder
//   ========================= */

//   const handleSubmit = async () => {
//     if (!inputValue.trim()) return;

//     const res = await fetch(`/api/directory/${roomId}`, {
//       method: "POST",
//       body: JSON.stringify({
//         name: inputValue,
//         parentId: item._id,
//         type: creating.type,
//       }),
//     });

//     const newItem = await res.json();

//     if (creating.type === "file") {
//       addFile(item._id, newItem);
//     } else {
//       addFolder(item._id, newItem);
//     }

//     setInputValue("");
//     setCreating({ parentId: null, type: null });
//   };

//   return (
//     <div className="ml-4 text-sm">
//       <Collapsible
//         onOpenChange={(open) => {
//           if (open) loadFolder(roomId, item._id);
//         }}
//       >
//         <CollapsibleTrigger
//           onClick={() => setSelected(item._id)}
//           className="flex items-center gap-1 py-1 hover:bg-[#2a2d2e] rounded px-1"
//         >
//           <ChevronRight className="w-4 h-4" />
//           <Folder className="w-4 h-4 text-yellow-400" />
//           {item.name}
//         </CollapsibleTrigger>

//         <CollapsibleContent>
//           {loading && (
//             <div className="px-2 py-1">
//               <Spinner />
//             </div>
//           )}

//           {/* FILES */}

//           {files.map((file) => (
//             <div key={file._id} className="flex items-center gap-2 py-1">
//               <File className="w-4 h-4 text-blue-400" />
//               {file.name}
//             </div>
//           ))}

//           {/* FOLDERS */}

//           {folders.map((folder) => (
//             <FolderItem
//               key={folder._id}
//               item={folder}
//               roomId={roomId}
//               creating={creating}
//               setCreating={setCreating}
//               setSelected={setSelected}
//             />
//           ))}

//           {/* CREATE INPUT */}

//           {creating.parentId === item._id && (
//             <div className="flex items-center gap-2 py-1">
//               {creating.type === "file" ? (
//                 <File className="w-4 h-4 text-blue-400" />
//               ) : (
//                 <Folder className="w-4 h-4 text-yellow-400" />
//               )}

//               <input
//                 autoFocus
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSubmit();

//                   if (e.key === "Escape") {
//                     setCreating({ parentId: null, type: null });
//                   }
//                 }}
//                 className="bg-transparent border border-[#3a3d3e] px-1 text-sm outline-none"
//               />
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>
//     </div>
//   );
// }

// export default memo(FolderItem);

"use client";

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

  const indent = depth * 14;

  /* =========================
     Create File / Folder
  ========================= */

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

    if (creating.type === "file") {
      addFile(item._id, newItem);
    } else {
      addFolder(item._id, newItem);
    }

    setInputValue("");
    setCreating({ parentId: null, type: null });
  };

  return (
    <div style={{ paddingLeft: indent }} className="text-sm">
      <Collapsible
        onOpenChange={(open) => {
          if (open) loadFolder(roomId, item._id);
        }}
        className="group"
      >
        <CollapsibleTrigger
          onClick={() => setSelected(item._id)}
          className="flex items-center gap-2 py-1 hover:bg-[#2a2d2e] rounded px-1"
        >
          <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
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
            const ext = file.name.split(".").pop();

            return (
              <div key={file._id} className="flex items-center gap-2 py-1 pl-6">
                <div className="w-4 h-4">
                  <FileIcon extension={ext} {...defaultStyles[ext]} />
                </div>

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
              setSelected={setSelected}
              depth={depth + 1}
            />
          ))}

          {/* CREATE INPUT */}

          {creating.parentId === item._id && (
            <div className="flex items-center gap-2 py-1 pl-6">
              <Folder className="w-4 h-4 text-yellow-400" />

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
    </div>
  );
}

export default memo(FolderItem);
