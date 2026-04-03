import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function ExplorerMenu({
  id,
  name,
  children,
  onRename,
  onDelete,
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-40 bg-[#3a3d3e] border-[#3a3d3e]">
        <ContextMenuItem
          onClick={() => onRename(id, name)}
          className="text-gray-200"
        >
          Rename
        </ContextMenuItem>

        <ContextMenuItem className="text-red-500" onClick={() => onDelete(id)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
