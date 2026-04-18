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
import useChat from "@/lib/useChat";

import {
  CircleX,
  CopyIcon,
  Edit3,
  EllipsisVertical,
  ReplyIcon,
} from "lucide-react";

import { Fira_Code } from "next/font/google";
import { memo, useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
});

function ChatBubble({
  id,
  name,
  content,
  timeStamp,
  image,
  roomId,
  edited,
  pending, // 👈 optional if you use it
}) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedMsg, setEditedMsg] = useState(content);

  const { editMessage, deleteMessage } = useChat(roomId);

  // 🔥 sync external updates
  useEffect(() => {
    setEditedMsg(content);
  }, [content]);

  const isLong = useMemo(() => content?.length > 248, [content]);

  // 🔹 COPY
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied");
  };

  // 🔹 EDIT
  const handleEdit = () => {
    const text = editedMsg.trim();

    if (!text) {
      toast.error("Message cannot be empty");
      return;
    }

    if (text === content) {
      setIsEdit(false);
      return;
    }

    // 🔥 optimistic update
    useChatstore.getState().editMsg(roomId, id, text);

    editMessage(id, text);
    setIsEdit(false);
  };

  // 🔹 DELETE
  const handleDelete = () => {
    // 🔥 optimistic update
    useChatstore.getState().deleteMsg(roomId, id);

    deleteMessage(id);
  };

  return (
    <div
      className={`${firaCode.className}
        bg-slate-800 text-slate-200 
        px-4 py-3 rounded-lg 
        max-w-md shadow-md mt-4`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-2">
          <Avatar className="size-5">
            <AvatarImage src={image} />
            <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="capitalize text-xs">{name}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {formatte(timeStamp).split("at")[1]}

          {edited && (
            <span className="text-[10px] italic text-slate-500">(edited)</span>
          )}

          {pending && (
            <span className="text-[10px] text-yellow-400">(updating...)</span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-slate-700">
                <EllipsisVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-slate-800 text-slate-200 border-slate-800"
            >
              <DropdownMenuItem>
                reply <ReplyIcon />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleCopy}>
                Copy <CopyIcon />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDelete} className="text-red-400">
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

      {/* CONTENT */}
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
              className="text-xs px-3 py-1 rounded bg-slate-700"
            >
              Cancel
            </button>

            <button
              onClick={handleEdit}
              className="text-xs px-3 py-1 rounded bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <pre
          className={`text-sm whitespace-pre-wrap break-words ${
            !show && isLong ? "max-h-40 overflow-hidden" : ""
          }`}
        >
          {content}
        </pre>
      )}

      {/* EXPAND */}
      {isLong && !isEdit && (
        <button
          onClick={() => setShow(!show)}
          className="text-xs text-blue-400 mt-2"
        >
          {show ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default memo(ChatBubble);
