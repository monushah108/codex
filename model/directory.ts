import { model, models, Schema } from "mongoose";

const directorySchema = new Schema(
  {
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

const Directory = models.Directory || model("Directory", directorySchema);

export default Directory;
