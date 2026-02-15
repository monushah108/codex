import { model, Schema } from "mongoose";

const folderSchema = new Schema(
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
      ref: "Folder",
    },
  },
  {
    strict: "throw",
  },
);

const Folder = model("Folder", folderSchema);

export default Folder;
