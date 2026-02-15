import { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  {
    statics: "throw",
  },
);
