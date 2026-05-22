import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    type: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },

    password: {
      type: String,
      required: function () {
        return this.type === "private";
      },
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rootDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },

    // NEW FEATURES

    isPermanent: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    maxUsers: {
      type: Number,
      default: 10,
      min: 1,
      max: 500,
    },

    currentUsers: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// AUTO DELETE EXPIRED ROOMS
roomSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      isPermanent: false,
    },
  },
);

roomSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

roomSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Room = models.Room || model("Room", roomSchema);

export default Room;
