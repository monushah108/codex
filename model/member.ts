import { model, models, Schema } from "mongoose";

const memberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    role: {
      type: String,
      enum: ["admin", "manager", "user"], // ✅ fixed
      default: "user",
    },

    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
  },
  { timestamps: true },
);

const Member = models.Member || model("Member", memberSchema);

export default Member;
