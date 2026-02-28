import { model, Schema } from "mongoose";

const memberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  role: {
    type: String,
    enums: ["admin", "manager", "user"],
    default: "user",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
});

const Member = model("Member", memberSchema);

export default Member;
