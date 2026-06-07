import { model, models, Schema } from "mongoose";

const memberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
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

//
// UNIQUE MEMBER
//

memberSchema.index(
  {
    userId: 1,
    roomId: 1,
  },
  {
    unique: true,
  },
);

//
// FAST ROOM MEMBER QUERY
//

memberSchema.index({
  roomId: 1,
});

//
// FAST USER ROOM QUERY
//

memberSchema.index({
  userId: 1,
});

//
// ONLINE USERS
//

memberSchema.index({
  roomId: 1,
  isOnline: 1,
});

const Member = models.Member || model("Member", memberSchema);

export default Member;
