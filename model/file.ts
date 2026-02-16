import { model, Schema } from "mongoose";

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Directory",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const File = model("File", fileSchema);

export default File;
