import { Schema } from "mongoose";

const chatSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});
