import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Chat",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  repliedId: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = model("Message", messageSchema);

export default Message;
