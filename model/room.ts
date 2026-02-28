import { model, models, Schema } from "mongoose";

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Directory",
    default: null,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Room = model("Room", roomSchema);

export default Room;
