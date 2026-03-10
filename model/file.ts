import { model, models, Schema } from "mongoose";

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

const File = models.File || model("File", fileSchema);

export default File;
