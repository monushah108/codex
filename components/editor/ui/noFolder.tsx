import { Button } from "@/components/ui/button";
import { FilePlus, FolderOpen } from "lucide-react";
import { useRef } from "react";

// export default function NoFolder({ Isproject }) {
//   const folderRef = useRef<HTMLInputElement>(null);

//   const handleOpenFolder = () => {
//     console.log("open folder");
//   };
//   return (
//     <div
//       style={{ display: Isproject && "none" }}
//       className="flex flex-col items-center justify-center mt-10 gap-4 p-4 text-center text-gray-400 max-w-max m-auto"
//     >
//       <p className="text-sm">no folder opended & created in room yet !!</p>

//       <Button size="sm" className="w-full bg-sky-500 hover:bg-sky-500/50">
//         <FilePlus />
//         Create Project
//       </Button>
//       <input
//         type="file"
//         ref={folderRef}
//         className="hidden"
//         onChange={handleOpenFolder}
//       />
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={() => folderRef.current.click()}
//         className="w-full"
//       >
//         <FolderOpen /> Open Folder
//       </Button>
//     </div>
//   );
// }

export default function NoFolder() {
  const folderRef = useRef<HTMLInputElement>(null);

  const handleOpenFolder = () => {
    console.log("open folder");
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-4 p-4 text-center text-gray-400 max-w-max m-auto">
      <p className="text-sm">No project created in this room yet</p>

      <Button size="sm" className="w-full bg-sky-500 hover:bg-sky-500/50">
        <FilePlus />
        Create Project
      </Button>

      <input
        type="file"
        ref={folderRef}
        className="hidden"
        onChange={handleOpenFolder}
      />

      <Button
        size="sm"
        variant="outline"
        onClick={() => folderRef.current?.click()}
        className="w-full"
      >
        <FolderOpen /> Open Folder
      </Button>
    </div>
  );
}
