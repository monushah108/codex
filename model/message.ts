import { model, models, Schema } from "mongoose";

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
    default: null,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ chatId: 1, timeStamp: -1 });

const Message = models.Message || model("Message", messageSchema);

export default Message;
