import { model, Schema } from "mongoose";

const directorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Directory",
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  {
    strict: "throw",
  },
);

const Directory = model("Directory", directorySchema);

export default Directory;
