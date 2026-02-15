import { Schema } from "mongoose";

const memberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  role: {
    type: String,
    enums: ["admin", "manager", "viwer", "employee"],
    default: "employee",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
});
