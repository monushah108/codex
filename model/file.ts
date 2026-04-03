import { model, models, Schema } from "mongoose";

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parentDirId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Directory",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  url: {
    type: String,
  },
});

const File = models.File || model("File", fileSchema);

export default File;
