import { useCallback, useEffect } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";

type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type TerminalOutput = {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
};

type MessagesEvent = {
  payload: AiMessage;
};

type TerminalEvent = {
  data: TerminalOutput;
  roomId: string;
};

export default function useAiChatSocket({ roomId }: { roomId: string | null }) {
  const user = useCodestore((state) => state.user);

  useEffect(() => {
    if (!roomId || !user) return;
    console.log("socket room:", roomId, user);
    socket.emit("explorer:join", { roomId, user });

    const handleAiMessages = ({ payload }: MessagesEvent) => {
      useCodestore.setState((state) => ({
        response: {
          ...state.response,
          data: [...state.response.data, payload],
        },
      }));
    };

    const handleTerminal = ({ roomId, data }: TerminalEvent) => {
      console.log("socket ", data);
      useCodestore.getState().addOutput(data);
    };

    socket.on("messages", handleAiMessages);
    socket.on("terminal", handleTerminal);

    return () => {
      socket.off("messages", handleAiMessages);
      socket.off("terminal", handleTerminal);
    };
  }, [roomId]);

  const applyResponse = useCallback(
    (payload: AiMessage) => {
      if (!roomId || !user) return;

      socket.emit("messages", {
        roomId,
        user,
        payload,
      });
    },
    [roomId, user],
  );

  const applyOutput = useCallback(
    (output: TerminalOutput) => {
      if (!roomId) return;

      socket.emit("terminal", {
        roomId,
        data: output,
      });
    },
    [roomId],
  );

  return {
    applyResponse,
    applyOutput,
  };
}

/* TODO: not working */
