import { model, models } from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: "Room",
    required: true,
  },
});

const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;
