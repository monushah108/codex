export const chatAction = {
  addMsg: async (roomId: string, content: string, msgId: string) => {
    const res = await fetch(`/api/playground/${roomId}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        msgId,
      }),
    });

    return res.json();
  },

  loadMsg: async (roomId: string, cursor: string) => {
    const res = await fetch(`/api/playground/${roomId}/chat?cursor=${cursor}`, {
      credentials: "include",
    });

    return res.json();
  },

  deleteMsg: async (roomId: string, msgId: string) => {
    await fetch(`/api/playground/${roomId}/chat`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ msgId }),
    });
  },

  editMsg: async (roomId: string, msgId: string, newText: string) => {
    await fetch(`/api/playground/${roomId}/chat`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ msgId, newText }),
    });
  },
};
