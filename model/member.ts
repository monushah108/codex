import { model, models, Schema } from "mongoose";

const memberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
      index: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

memberSchema.index({ userId: 1, roomId: 1 }, { unique: true });

memberSchema.index({ roomId: 1 });

memberSchema.index({ userId: 1 });

const Member = models.Member || model("Member", memberSchema);

export default Member;
