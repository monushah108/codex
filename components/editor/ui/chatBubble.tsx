import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

import { formatte } from "@/lib/features";
import { useChatstore } from "@/lib/store/Chatstore";
import {
  CircleX,
  CopyIcon,
  Edit3,
  EllipsisVertical,
  ReplyIcon,
} from "lucide-react";
import { Fira_Code } from "next/font/google";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
});

function ChatBubble({ id, name, content, timeStamp, image, roomId }) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedMsg, setEditedMsg] = useState(content);
  const deleteMsg = useChatstore((state) => state.deleteMsg);
  const editMsg = useChatstore((state) => state.editMsg);

  const isLong = useMemo(() => content?.length > 248, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  const EditMsg = async (e) => {
    setIsEdit(false);
    editMsg(roomId, id, editedMsg);
    if (!editedMsg.trim()) return;
    try {
      await fetch(`/api/playground/${roomId}/chat`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, editedMsg }),
      });
    } catch {
      toast.error("server error");
    }
  };

  const DeleteMsg = async () => {
    console.log(roomId, id);
    deleteMsg(roomId, id);
    try {
      await fetch(`/api/playground/${roomId}/chat`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.log(err);
      toast.error("server error");
    }
  };

  const replyMsg = async () => {};

  return (
    <div
      key={id}
      className={`${firaCode.className} 
        bg-slate-800 
        text-slate-200 
        px-4 py-3 
        rounded-lg 
        max-w-md 
        shadow-md 
        mt-4`}
    >
      {/* Header */}

      <div className="flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-1">
          <Avatar className="cursor-pointer size-5">
            <AvatarImage src={image} />
            <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="capitalize text-xs">{name}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {formatte(timeStamp).split("at")[1]}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-slate-700 transition">
                <EllipsisVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-slate-800 
        text-slate-200  border-slate-800 shadow-md"
            >
              <DropdownMenuItem onClick={replyMsg}>
                reply <ReplyIcon />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                Copy <CopyIcon />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={DeleteMsg} className="text-red-400">
                Delete <CircleX />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsEdit(true)}>
                Edit <Edit3 />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator className="my-2 bg-slate-600" />

      {/* Code Content */}
      {isEdit ? (
        <div className="space-y-2">
          <textarea
            autoFocus
            value={editedMsg}
            onChange={(e) => setEditedMsg(e.target.value)}
            className="w-full bg-slate-900 text-slate-200 
               text-sm p-3 rounded-md 
               border border-slate-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500
               resize-none"
            rows={4}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditedMsg(content);
                setIsEdit(false);
              }}
              className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={EditMsg}
              className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <pre
          className={`text-sm whitespace-pre-wrap break-words transition-all duration-300 ${
            !show && isLong ? "max-h-40 overflow-hidden" : ""
          }`}
        >
          {content}
        </pre>
      )}

      {/* Expand Toggle */}
      {isLong && (
        <button
          onClick={() => setShow(!show)}
          className="text-xs text-blue-400 mt-2 hover:text-blue-300 transition"
        >
          {show ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default memo(ChatBubble);
